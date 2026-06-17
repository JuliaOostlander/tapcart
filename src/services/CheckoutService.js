const CHECKOUT_STORAGE_KEY = "selfScan.checkoutPayload";

export class CheckoutService {
    constructor(storage = window.localStorage) {
        this.storage = storage;
    }

    createCheckoutQrString(cartItems, interactionEvents = []) {
        const payload = {
            type: "SELF_SCAN_CHECKOUT",
            createdAt: new Date().toISOString(),
            products: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            logs: interactionEvents
        };

        this.savePayload(payload);

        return JSON.stringify(payload);
    }

    savePayload(payload) {
        this.storage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(payload));
    }
}
