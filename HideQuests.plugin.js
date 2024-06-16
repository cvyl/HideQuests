/**
 * @name HideQuests
 * @version 1.0.1
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
        const badgeSelectors = [
            '#my-account-tab > div > div:nth-child(1) > div[class^="children"] > div > div[class^="userInfo"] > div:nth-child(2) > div[class^="container"][class*="badgeList"] > div:nth-child(5)',
            '[id^="popout_"] > div > div > div > div > div[class^="body"] > div[class^="container"] > div[class^="tags"][class*="biteSize"] > div[class^="container"] > div:nth-child(5)',
            '[id^="popout_"] > div > div > div > div > div[class^="body"] > div[class^="container"] > div[class^="tags"][class*="biteSize"] > div[class^="container"] > div:nth-child(2)'
        ];

        badgeSelectors.forEach(selector => {
            const badges = document.querySelectorAll(selector);
            badges.forEach(badge => badge.remove());
        });
    }
}
