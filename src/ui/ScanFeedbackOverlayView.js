import {appSettings} from "../settings.js";

export class ScanFeedbackOverlayView {
    constructor(elements) {
        this.overlay = elements.scanFeedbackOverlay;
        this.image = elements.scanFeedbackImage;
        this.category = elements.scanFeedbackCategory;
        this.kicker = elements.scanFeedbackKicker;
        this.name = elements.scanFeedbackName;
        this.timeoutId = null;
    }

    showProductAdded(product) {
        this.show({
            // image: product.image,
            image: "./assets/images/product-added.png",
            imageAlt: product.name,
            category: product.category,
            kicker: "Added to cart",
            name: product.name
        });
    }

    showWrongProduct() {
        this.show({
            image: "./assets/images/wrong-product.png",
            imageAlt: "Wrong product",
            category: "",
            kicker: "Not added to cart",
            name: "Wrong product"
        });
    }

    show({image, imageAlt, category, kicker, name}) {
        window.clearTimeout(this.timeoutId);

        this.image.src = image;
        this.image.alt = imageAlt;
        this.category.textContent = category;
        this.kicker.textContent = kicker;
        this.name.textContent = name;

        this.category.style.display = category ? "" : "none";

        if (!this.overlay.open) {
            this.overlay.showModal();
        }

        this.timeoutId = window.setTimeout(
            () => this.close(),
            appSettings.animationDurationMs
        );
    }

    close() {
        window.clearTimeout(this.timeoutId);

        if (this.overlay.open) {
            this.overlay.close();
        }
    }
}
