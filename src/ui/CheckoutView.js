import {createCoinAmountHtml} from "../utils/formatters.js";

export class CheckoutView {
    constructor(elements, qrCodeGeneratorService, handlers = {}) {
        this.handlers = handlers;

        this.cancelButton = elements.checkoutCancelButton;
        this.confirmButton = elements.checkoutConfirmButton;

        this.actions = elements.checkoutActions;
        this.image = elements.checkoutImage;
        this.popup = elements.checkoutPopup;
        this.qrCodeContainer = elements.checkoutQrCode;
        this.qrCodeGeneratorService = qrCodeGeneratorService;
        this.totalPrice = elements.checkoutTotalPrice;

        this.qrIsShown = false;
        this.defaultConfirmButtonText = this.confirmButton.textContent;
    }

    bindEvents() {
        this.cancelButton.addEventListener("click", () => this.close());

        this.confirmButton.addEventListener("click", () => {
            if (this.qrIsShown) {
                this.close();
                return;
            }

            this.handlers.onConfirm?.();
        });
    }

    open(cartItems, totalPrice) {
        this.qrIsShown = false;

        this.actions.classList.remove("is-confirmed");
        this.cancelButton.style.display = "";
        this.confirmButton.textContent = this.defaultConfirmButtonText;
        this.qrCodeContainer.innerHTML = `
            <img 
                id="checkout-image" 
                class="checkout-image" 
                src="./assets/images/checkout-image.png" 
                alt="Image displaying a full basket" 
            />
        `;
        this.totalPrice.innerHTML = `
            <span>${cartItems.length} item types · </span>
            ${createCoinAmountHtml(totalPrice)}
        `;

        this.popup.showModal();
    }

    showQrCode(qrString) {
        this.updatedConfirmButtonText();

        this.qrIsShown = true;

        this.image.style.display = "none";
        this.qrCodeGeneratorService.generate(this.qrCodeContainer, qrString);
    }

    updatedConfirmButtonText() {
        this.confirmButton.textContent = "Done";
        this.cancelButton.style.display = "none";
        this.actions.classList.add("is-confirmed");
    }

    close() {
        this.qrCodeContainer.innerHTML = "";
        this.popup.close();

        this.handlers.onClose?.();
    }
}
