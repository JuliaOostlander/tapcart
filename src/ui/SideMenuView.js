export class SideMenuView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.closeButton = elements.sideMenuClose;
        this.sideMenu = elements.sideMenu;
        this.openSideMenuButton = elements.sideMenuButton;

        this.homeButton = elements.homeButton;
        this.settingsButton = elements.settingsButton;
        this.manualProductTestingButton = elements.manualTestingButton;
        this.miniGameFastScanButton = elements.miniGameFastScanButton;
        this.aboutButton = elements.aboutButton;
    }

    bindEvents() {
        this.closeButton.addEventListener("click", () => this.close());

        this.sideMenu.addEventListener("click", event => {
            if (event.target === this.sideMenu) {
                this.close();
            }
        });

        this.openSideMenuButton.addEventListener("click", () => this.open());

        this.homeButton.addEventListener("click", () => {
            this.close();
            this.handlers.onHome?.();
        });

        this.settingsButton.addEventListener("click", () => {
            this.close();
            this.handlers.onSettings?.();
        });

        this.manualProductTestingButton.addEventListener("click", () => {
            this.close();
            this.handlers.onManualTesting?.();
        });

        this.miniGameFastScanButton.addEventListener("click", () => {
            this.close();
            this.handlers.onMiniGameFastScan?.();
        });

        this.aboutButton.addEventListener("click", () => {
            this.close();
            this.handlers.onAbout?.();
        });
    }

    open() {
        this.sideMenu.classList.remove("is-closed");
        this.sideMenu.classList.add("is-open");
        this.sideMenu.setAttribute("aria-hidden", "false");
    }

    close() {
        this.sideMenu.classList.remove("is-open");
        this.sideMenu.classList.add("is-closed");
        this.sideMenu.setAttribute("aria-hidden", "true");
    }
}
