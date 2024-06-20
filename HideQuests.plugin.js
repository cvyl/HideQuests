/**
 * @name HideQuests
 * @version 1.1.0
 * @description Hides/Removes the "Quests" tab and quest badges in Discord. Now with changelog and customizable settings.
 * @author Mikka
 * @authorId 390527881891151872
 * @authorLink https://github.com/cvyl
 * @donate https://github.com/sponsors/cvyl
 * @website https://cvyl.me
 * @source https://github.com/cvyl/HideQuests/blob/main/HideQuests.plugin.js
 * @updateUrl https://raw.githubusercontent.com/cvyl/HideQuests/main/HideQuests.plugin.js
 */

module.exports = (() => {
    const config = {
        info: {
            name: "HideQuests",
            version: "1.1.0",
            description: "Hides/Removes the 'Quests' tab and quest badges in Discord. Now with changelog and customizable settings.",
        },
        changelog: [
            {
                title: "Improvements",
                type: "added",
                items: [
                    "Added settings to toggle hiding Quests tab and quest badges.",
                    "Added a changelog section."
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

    return class HideQuests {
        constructor() {
            this.settings = BdApi.loadData(config.info.name, "settings") || {
                hideQuestTab: true,
                hideQuestBadge: true
            };
        }

        start() {
            if (this.settings.hideQuestTab) this.hideQuests();
            if (this.settings.hideQuestBadge) this.hideQuestBadge();
            this.observer = new MutationObserver(() => {
                if (this.settings.hideQuestTab) this.hideQuests();
                if (this.settings.hideQuestBadge) this.hideQuestBadge();
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        stop() {
            this.observer.disconnect();
        }

        hideQuests() {
            const questContainer = document.querySelector('#library-inventory-tab > div[class^="questsContainer"]');
            if (questContainer) {
                questContainer.setAttribute('hidden', 'true');
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
                            lastChild.setAttribute('hidden', 'true');
                        }
                    }
                });
            });
        }

        getSettingsPanel() {
            const panel = document.createElement("div");
            panel.style.padding = "10px";

            config.defaultConfig.forEach(setting => {
                const container = document.createElement("div");
                container.style.marginBottom = "10px";

                const label = document.createElement("label");
                label.innerText = setting.name;
                label.style.display = "block";
                label.style.marginBottom = "5px";

                const note = document.createElement("small");
                note.innerText = setting.note;
                note.style.display = "block";
                note.style.marginBottom = "5px";

                const input = document.createElement("input");
                input.type = "checkbox";
                input.checked = this.settings[setting.id];
                input.onchange = () => {
                    this.settings[setting.id] = input.checked;
                    BdApi.saveData(config.info.name, "settings", this.settings);
                    this.stop();
                    this.start();
                };

                container.appendChild(label);
                container.appendChild(note);
                container.appendChild(input);
                panel.appendChild(container);
            });

            const changelogTitle = document.createElement("h3");
            changelogTitle.innerText = "Changelog";
            panel.appendChild(changelogTitle);

            config.changelog.forEach(change => {
                const changeTitle = document.createElement("h4");
                changeTitle.innerText = `${change.title} (${change.type})`;
                panel.appendChild(changeTitle);

                const changeList = document.createElement("ul");
                change.items.forEach(item => {
                    const listItem = document.createElement("li");
                    listItem.innerText = item;
                    changeList.appendChild(listItem);
                });
                panel.appendChild(changeList);
            });

            return panel;
        }
    };
})();
