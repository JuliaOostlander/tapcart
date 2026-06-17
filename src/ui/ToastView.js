import {appSettings} from "../settings.js";

export class ToastView {
    constructor(toastElement) {
        this.toastElement = toastElement;
        this.timeoutId = null;
    }

    show(message, duration = appSettings.animationDurationMs) {
        this.toastElement.textContent = message;
        this.toastElement.classList.add("show");

        window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => {
            this.toastElement.classList.remove("show");
        }, duration);
    }
}
