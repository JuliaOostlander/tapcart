import {appSettings} from "../settings.js";

export class AddedToCartFeedbackPopupView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.popup = elements.addedToCartFeedbackPopup;

        this.image = elements.addedToCartFeedbackImage;
        this.category = elements.addedToCartFeedbackCategory;
        this.kicker = elements.addedToCartFeedbackKicker;
        this.name = elements.addedToCartFeedbackName;

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

        if (!this.popup.open) {
            this.popup.showModal();
        }

        this.timeoutId = window.setTimeout(
            () => this.close(),
            appSettings.animationDurationMs
        );
    }

    close() {
        window.clearTimeout(this.timeoutId);

        if (this.popup.open) {
            this.popup.close();
        }

        this.handlers.onClose?.();
    }
}
