import {formatMoney} from "../utils/formatters.js";

export class ProductDetailsPopupView {
    constructor(els) {
        this.els = els;
    }

    bindEvents() {
        this.els.closePopup.addEventListener("click", () => this.close());
        this.els.popup.addEventListener("click", event => {
            if (event.target === this.els.popup) this.close();
        });
    }

    open(product) {
        if (!product) return;

        this.els.popupImage.src = product.image;
        this.els.popupImage.alt = product.name;
        this.els.popupCategory.textContent = product.category;
        this.els.popupName.textContent = product.name;
        this.els.popupDescription.textContent = product.description;
        this.els.popupPrice.textContent = formatMoney(product.price);
        this.els.popupId.textContent = product.id;
        this.els.popup.showModal();
    }

    isOpen() {
        return this.els.popup.open;
    }

    close() {
        this.els.popup.close();
    }
}
