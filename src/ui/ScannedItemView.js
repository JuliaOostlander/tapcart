import {createCoinAmountHtml} from "../utils/formatters.js";

export class ScannedItemView {
    constructor(elements) {
        this.els = elements;
        this.cancelButton = elements.scannedItemCancelButton;
        this.confirmButton = elements.scannedItemConfirmButton;
        this.cancelButton.addEventListener("click", () => this.close());
        this.currentProduct = null;
        this.detailsButton = elements.scannedItemDetailsButton;
    }

    open(product) {
        if (!product) return;

        this.currentProduct = product;

        this.els.scannedItemImage.src = product.image;
        this.els.scannedItemImage.alt = product.name;
        this.els.scannedItemCategory.textContent = product.category;
        this.els.scannedItemName.textContent = product.name;
        this.els.scannedItemDescription.textContent = product.description;
        this.els.scannedItemPrice.innerHTML = `${createCoinAmountHtml(product.price)}`;

        this.els.scannedItemPopup.showModal();
    }

    onConfirm(callback) {
        this.confirmButton.addEventListener("click", () => {
            if (!this.currentProduct) return;

            callback(this.currentProduct);
            this.close();
        });
    }

    isOpen() {
        return this.els.scannedItemPopup.open;
    }

    onDetails(callback) {
        this.detailsButton.addEventListener("click", () => {
            callback(this.currentProduct);
        });
    }

    close() {
        this.els.scannedItemPopup.close();
        this.currentProduct = null;

        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    onClose(callback) {
        this.onCloseCallback = callback;
    }
}
