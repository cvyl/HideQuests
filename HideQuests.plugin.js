/**
 * @name HideQuests
 * @version 1.0.2
 * @description Hides/Removes the "Quests" tab and quest badges in Discord.
 * @author Mikka
 * @authorId 390527881891151872
 * @authorLink https://github.com/cvyl
 * @donate https://github.com/sponsors/cvyl
 * @website https://cvyl.me
 * @source https://github.com/cvyl/BDHideQuests/blob/main/HideQuests.plugin.js
 */

module.exports = class HideQuest {
    start() {
        this.hideQuests();
        this.hideQuestBadge();
        this.observer = new MutationObserver(() => {
            this.hideQuests();
            this.hideQuestBadge();
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    stop() {
        this.observer.disconnect();
    }

    hideQuests() {
        const questContainer = document.querySelector('#library-inventory-tab > div[class^="questsContainer"]');
        if (questContainer) {
            questContainer.remove();
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
                        lastChild.remove();
                    }
                }
            });
        });
    }
}