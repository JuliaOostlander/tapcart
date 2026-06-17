export class SideMenuView {
    constructor(elements) {
        this.menu = elements.sideMenu;
        this.openButton = elements.menuButton;
        this.closeButton = elements.sideMenuClose;
    }

    bindEvents() {
        this.openButton.addEventListener("click", () => this.open());
        this.closeButton.addEventListener("click", () => this.close());

        this.menu.addEventListener("click", event => {
            if (event.target === this.menu) {
                this.close();
            }
        });
    }

    open() {
        this.menu.classList.remove("is-closed");
        this.menu.classList.add("is-open");
        this.menu.setAttribute("aria-hidden", "false");
    }

    close() {
        this.menu.classList.remove("is-open");
        this.menu.classList.add("is-closed");
        this.menu.setAttribute("aria-hidden", "true");
    }
}