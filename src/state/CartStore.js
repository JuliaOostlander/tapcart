const CART_STORAGE_KEY = "selfScanCart";

export class CartStore {
    constructor(storage = localStorage) {
        this.storage = storage;
        this.items = this.loadCart();
    }

    getItems() {
        return this.items;
    }

    addProduct(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({id: product.id, quantity: 1});
        }

        this.saveCart();
    }

    changeQuantity(productId, delta) {
        const item = this.items.find(cartItem => cartItem.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        this.saveCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    clearChart() {
        this.items = [];
        this.saveCart();
    }

    loadCart() {
        try {
            return JSON.parse(this.storage.getItem(CART_STORAGE_KEY)) || [];
        } catch (error) {
            console.error(
                "[CartStore] Failed to load cart from localStorage.",
                error
            );
            return [];
        }
    }

    saveCart() {
        this.storage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    }

    getTotalPrice(productsById) {
        return this.items.reduce((total, cartItem) => {
            const product = productsById.get(cartItem.id);

            if (!product) {
                console.warn("[CartStore] Product missing for cart item:", cartItem.productId);
                return total;
            }

            return total + product.price * cartItem.quantity;
        }, 0);
    }
}
