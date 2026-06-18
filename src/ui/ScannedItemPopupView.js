import {createCoinAmountHtml} from "../utils/formatters.js";

export class ScannedItemPopupView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.cancelButton = elements.scannedItemCancelButton;
        this.confirmButton = elements.scannedItemConfirmButton;
        this.detailsButton = elements.scannedItemDetailsButton;

        this.popup = elements.scannedItemPopup;

        this.category = elements.scannedItemCategory;
        this.description = elements.scannedItemDescription;
        this.image = elements.scannedItemImage;
        this.name = elements.scannedItemName;
        this.price = elements.scannedItemPrice;

        this.currentProduct = null;
    }

    bindEvents() {
        this.cancelButton.addEventListener("click", () => this.close());

        this.confirmButton.addEventListener("click", () => {
            if (!this.currentProduct) return;

            this.handlers.onConfirm?.(this.currentProduct);
            this.close();
        });

        this.detailsButton.addEventListener("click", () => {
            if (!this.currentProduct) return;

            this.handlers.onDetails?.(this.currentProduct);
        });
    }

    open(product) {
        if (!product) return;

        this.currentProduct = product;

        this.image.src = product.image;
        this.image.alt = product.name;
        this.category.textContent = product.category;
        this.name.textContent = product.name;
        this.description.textContent = product.description;
        this.price.innerHTML = `${createCoinAmountHtml(product.price)}`;

        this.popup.showModal();
    }

    isOpen() {
        return this.popup.open;
    }

    close() {
        this.popup.close();
        this.currentProduct = null;

        this.handlers.onClose?.();
    }
}
