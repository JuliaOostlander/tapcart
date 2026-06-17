import {createCoinAmountHtml} from "../utils/formatters.js";

export class CheckoutView {
    constructor(elements, qrCodeGeneratorService) {
        this.dialog = elements.checkoutDialog;
        this.cancelButton = elements.checkoutCancelButton;
        this.confirmButton = elements.checkoutConfirmButton;
        this.defaultConfirmButtonText = this.confirmButton.textContent;
        this.summary = elements.checkoutSummary;
        this.qrCodeContainer = elements.checkoutQrCode;
        this.checkoutImage = elements.checkoutImage;
        this.qrCodeGeneratorService = qrCodeGeneratorService;
        this.actions = elements.checkoutActions;
        this.qrIsShown = false;

        this.cancelButton.addEventListener("click", () => this.close());
    }

    open(cartItems, totalPrice) {
        this.qrIsShown = false;
        this.confirmButton.textContent = this.defaultConfirmButtonText;
        this.cancelButton.style.display = "";
        this.actions.classList.remove("is-confirmed");

        this.summary.innerHTML = `
            <span>${cartItems.length} item types · </span>
            ${createCoinAmountHtml(totalPrice)}
        `;

        this.qrCodeContainer.innerHTML = `<img id="checkout-image" class="checkout-image" src="./assets/images/checkout-image.png" alt="Image displaying a full basket" />`;
        this.dialog.showModal();
    }

    onConfirm(callback) {
        this.confirmButton.addEventListener("click", () => {
            if (this.qrIsShown) {
                this.close();
                return;
            }

            callback();
        });
    }

    showQrCode(qrString) {
        this.updatedConfirmButtonText();
        this.qrIsShown = true;

        this.checkoutImage.style.display = "none";
        this.qrCodeGeneratorService.generate(this.qrCodeContainer, qrString);
    }

    updatedConfirmButtonText() {
        this.confirmButton.textContent = "Done";
        this.cancelButton.style.display = "none";

        this.actions.classList.add("is-confirmed");
    }

    close() {
        this.qrCodeContainer.innerHTML = "";
        this.dialog.close();

        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    onClose(callback) {
        this.onCloseCallback = callback;
    }
}
