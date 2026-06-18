export class PageView {
    constructor(elements) {
        this.homePage = elements.homePage;
        this.settingsPage = elements.settingsPage;
        this.manualTestingPage = elements.manualTestingPage;
        this.miniGameFastScanPage = elements.miniGameFastScanPage;
        this.aboutPage = elements.aboutPage;
    }

    showHome() {
        this.showOnly(this.homePage);
    }

    showSettings() {
        this.showOnly(this.settingsPage);
    }

    showManualTesting() {
        this.showOnly(this.manualTestingPage);
    }

    showMiniGameFastScan() {
        this.showOnly(this.miniGameFastScanPage);
    }

    showAbout() {
        this.showOnly(this.aboutPage);
    }

    showOnly(activePage) {
        [this.homePage,
            this.aboutPage,
            this.settingsPage,
            this.manualTestingPage,
            this.miniGameFastScanPage
        ].forEach(page => {
            page.classList.toggle("is-active", page === activePage);
        });
    }
}