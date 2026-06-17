export class PageView {
    constructor(elements) {
        this.homePage = elements.homePage;
        this.aboutPage = elements.aboutPage;
        this.settingsPage = elements.settingsPage;
        this.manualTestingPage = elements.manualTestingPage;
        this.miniGameAsapPage = elements.miniGameAsapPage;
    }

    showHome() {
        this.showOnly(this.homePage);
    }

    showAbout() {
        this.showOnly(this.aboutPage);
    }

    showSettings() {
        this.showOnly(this.settingsPage);
    }

    showManualTesting() {
        this.showOnly(this.manualTestingPage);
    }

    showMiniGameAsap() {
        this.showOnly(this.miniGameAsapPage);
    }

    showOnly(activePage) {
        [this.homePage,
            this.aboutPage,
            this.settingsPage,
            this.manualTestingPage,
            this.miniGameAsapPage
        ].forEach(page => {
            page.classList.toggle("is-active", page === activePage);
        });
    }
}