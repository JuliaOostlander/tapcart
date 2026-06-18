import {formatMoney} from "../utils/formatters.js";

export class ProductDetailsPopupView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.closeButton = elements.closePopup;

        this.popup = elements.popup;

        this.category = elements.popupCategory;
        this.description = elements.popupDescription;
        this.id = elements.popupId;
        this.image = elements.popupImage;
        this.name = elements.popupName;
        this.price = elements.popupPrice;
    }

    bindEvents() {
        this.closeButton.addEventListener("click", () => this.close());

        this.popup.addEventListener("click", event => {
            if (event.target === this.popup) this.close();
        });
    }

    open(product) {
        if (!product) return;

        this.category.textContent = product.category;
        this.description.textContent = product.description;
        this.id.textContent = product.id;
        this.image.alt = product.name;
        this.image.src = product.image;
        this.name.textContent = product.name;
        this.price.textContent = formatMoney(product.price);

        this.popup.showModal();
    }

    isOpen() {
        return this.popup.open;
    }

    close() {
        this.popup.close();

        this.handlers.onClose?.();
    }
}
