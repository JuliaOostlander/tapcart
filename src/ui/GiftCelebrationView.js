export class GiftCelebrationView {
    constructor(elements) {
        this.overlay = elements.giftFireworksOverlay;
        this.canvasContainer = elements.giftFireworksCanvas;

        this.fireworks = null;
        this.timeoutId = null;

        if (!this.overlay || !this.canvasContainer){
            console.error("[GiftCelebrationView] Missing required HTML elements.", {
                overlay: this.overlay,
                canvasContainer: this.canvasContainer,
            });
            return;
        }
    }

    show() {
        if (!this.overlay || !this.canvasContainer) {
            console.error("[GiftCelebrationView] Cannot show celebration because HTML elements are missing.");
            return;
        }

        window.clearTimeout(this.timeoutId);

        this.overlay.classList.remove("is-hidden");
        this.overlay.classList.add("is-visible");
        this.overlay.setAttribute("aria-hidden", "false");

        if (!this.fireworks) {
            const FireworksConstructor = window.Fireworks?.default ?? window.Fireworks;

            if (!FireworksConstructor) {
                console.error("[GiftCelebrationView] Fireworks library was not loaded.");
                return;
            }

            //imported in index.html from https://cdn.jsdelivr.net/npm/fireworks-js@2.x/dist/index.umd.js
            this.fireworks = new FireworksConstructor(this.canvasContainer, {
                autoresize: true,
                opacity: 0.75,
                acceleration: 1.05,
                friction: 0.97,
                gravity: 1.5,
                particles: 90,
                traceLength: 3,
                traceSpeed: 8,
                explosion: 7,
                intensity: 40,
                flickering: 50,
                hue: { min: 0, max: 360 }
            });
        }

        this.fireworks.start();
        this.timeoutId = window.setTimeout(() => this.hide(), 4200);
    }

    hide() {
        window.clearTimeout(this.timeoutId);

        if (this.fireworks) {
            this.fireworks.stop();
        }

        this.overlay.classList.remove("is-visible");
        this.overlay.classList.add("is-hidden");
        this.overlay.setAttribute("aria-hidden", "true");
    }
}
