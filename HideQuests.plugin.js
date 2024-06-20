/**
 * @name HideQuests
 * @version 1.1.3
 * @description Hides/Removes the "Quests" tab and quest badges in Discord. Now with changelog and customizable settings.
 * @author Mikka
 * @authorId 390527881891151872
 * @authorLink https://github.com/cvyl
 * @donate https://github.com/sponsors/cvyl
 * @website https://cvyl.me
 * @source https://github.com/cvyl/HideQuests/blob/main/HideQuests.plugin.js
 * @updateUrl https://raw.githubusercontent.com/cvyl/HideQuests/main/HideQuests.plugin.js
 */

const config = {
    info: {
        name: "HideQuests",
        authors: [
            {
                name: "Mikka",
                discord_id: "390527881891151872",
                github_username: "cvyl",
            }
        ],
        version: "1.1.3",
        description: "Hides/Removes the 'Quests' tab and quest badges in Discord. Now with changelog and customizable settings.",
        github: "https://github.com/cvyl/HideQuests/blob/main/HideQuests.plugin.js",
        github_raw: "https://raw.githubusercontent.com/cvyl/HideQuests/main/HideQuests.plugin.js"
    },
    changelog: [
        {
            title: "Partial Rewrite (1.1.X+) using ZeresPluginLibrary",
            type: "added",
            items: [
                "Added support for ZeresPluginLibrary for better compatibility and performance.",
                "Added settings panel to toggle hiding Quests tab and quest badges.",
                "Older versions of the plugin will no longer be supported.",
                "Please report any issues on the GitHub repository."
            ]
        },
        {
            title: "Settings Panel (1.1.0)",
            type: "added",
            items: [
                "Added settings panel to toggle hiding Quests tab and quest badges individually."
            ]
        },
        {
            title: "Initial Release (1.0.0)",
            type: "added",
            items: [
                "Hides the Quests tab in the library.",
                "Hides the quest badges in profiles."
            ]
        }

    ],
    defaultConfig: [
        {
            type: "switch",
            id: "hideQuestTab",
            name: "Hide Quests Tab",
            note: "Toggle to hide the Quests tab in the library.",
            value: true
        },
        {
            type: "switch",
            id: "hideQuestBadge",
            name: "Hide Quest Badges",
            note: "Toggle to hide the quest badges in profiles.",
            value: true
        }
    ]
};

module.exports = !global.ZeresPluginLibrary ? class {
    constructor() { this._config = config; }
    load() {
        BdApi.showConfirmationModal("Library plugin is needed", 
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
                require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                    if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                    await require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, () => BdApi.Plugins.reload(config.info.name));
                });
            }
        });
    }
    start() { }
    stop() { }
} : (([Plugin, Library]) => {
    const { Settings } = Library;

    return class HideQuests extends Plugin {
        constructor() {
            super();
            this.settings = this.loadSettings(config.defaultConfig);
        }

        onStart() {
            this.hideElements();
            this.observer = new MutationObserver(() => this.hideElements());
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        onStop() {
            this.observer.disconnect();
            this.resetElements();
        }

        hideElements() {
            if (this.settings.hideQuestTab) this.hideQuests();
            if (this.settings.hideQuestBadge) this.hideQuestBadge();
        }

        resetElements() {
            this.resetQuests();
            this.resetQuestBadge();
        }

        hideQuests() {
            const questContainer = document.querySelector('#library-inventory-tab > div[class^="questsContainer"]');
            if (questContainer) {
                questContainer.style.display = 'none';
            }
        }

        hideQuestBadge() {
            const badgeContainersSelectors = [
                '#my-account-tab > div > div:nth-child(1) > div[class^="children"] > div > div[class^="userInfo"] > div:nth-child(2) > div[class^="container"][class*="badgeList"]',
                '[id^="popout_"] > div > div > div > div > div[class^="body"] > div[class^="container"] > div[class^="tags"][class*="biteSize"] > div[class^="container"]'
            ];

            badgeContainersSelectors.forEach(selector => {
                const badgeContainers = document.querySelectorAll(selector);
                badgeContainers.forEach(container => {
                    const lastChild = container.lastElementChild;
                    if (lastChild) {
                        const link = lastChild.querySelector('a[href="https://discord.com/settings/inventory"]');
                        if (link) {
                            lastChild.style.display = 'none';
                        }
                    }
                });
            });
        }

        resetQuests() {
            const questContainer = document.querySelector('#library-inventory-tab > div[class^="questsContainer"]');
            if (questContainer) {
                questContainer.style.display = '';
            }
        }

        resetQuestBadge() {
            const badgeContainersSelectors = [
                '#my-account-tab > div > div:nth-child(1) > div[class^="children"] > div > div[class^="userInfo"] > div:nth-child(2) > div[class^="container"][class*="badgeList"]',
                '[id^="popout_"] > div > div > div > div > div[class^="body"] > div[class^="container"] > div[class^="tags"][class*="biteSize"] > div[class^="container"]'
            ];

            badgeContainersSelectors.forEach(selector => {
                const badgeContainers = document.querySelectorAll(selector);
                badgeContainers.forEach(container => {
                    const lastChild = container.lastElementChild;
                    if (lastChild) {
                        const link = lastChild.querySelector('a[href="https://discord.com/settings/inventory"]');
                        if (link) {
                            lastChild.style.display = '';
                        }
                    }
                });
            });
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, value) => {
                this.settings[id] = value;
                this.saveSettings(this.settings);
                this.stop();
                this.start();
            });
            return panel.getElement();
        }
    };
})(global.ZeresPluginLibrary.buildPlugin(config));
