import {appSettings} from "../settings.js";

export class DiscountCelebrationView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.popup = elements.discountCardCelebrationPopup;

        this.timeoutId = null;
    }

    bindEvents() {
        this.popup.addEventListener("close", () => {
            this.clearAutoHideTimer();
            this.handlers.onClose?.();
        });
    }

    show() {
        this.clearAutoHideTimer();

        if (!this.popup.open) {
            this.popup.showModal();
        }

        this.restartAnimation();

        this.timeoutId = window.setTimeout(() => {
            this.hide();
        }, appSettings.easterEggCelebrationDurationMs);
    }

    hide() {
        this.clearAutoHideTimer();

        if (this.popup.open) {
            this.popup.close();
        }
    }

    restartAnimation() {
        this.popup.classList.remove("is-animating");

        void this.popup.offsetWidth;

        this.popup.classList.add("is-animating");
    }

    clearAutoHideTimer() {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }
}
