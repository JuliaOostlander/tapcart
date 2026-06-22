export class ProductService {
    constructor(productsUrl) {
        this.productsUrl = productsUrl;
        this.products = [];
        this.productsById = new Map();
    }

    async loadProducts() {
        const response = await fetch(this.productsUrl);

        if (!response.ok) {
            throw new Error(`Could not load products from ${this.productsUrl}`);
        }

        this.products = await response.json();
        this.productsById = new Map(
            this.products.map(product => [product.id, product])
        );
    }

    getAllProducts() {
        return this.products;
    }

    getTotalAmountOfProducts() {
        return this.products.length;
    }

    findById(productId) {
        return this.productsById.get(productId) ?? null;
    }

    findByIndex(productId) {
        return this.products[productId] ?? null;
    }

    getProductsById() {
        return this.productsById;
    }

    hydrateCartItems(cartItems) {
        return cartItems
            .map(item => ({...this.findById(item.id), quantity: item.quantity}))
            .filter(item => item.id);
    }

    isGiftProduct(product) {
        return product?.specialEffect === "easterEgg";
    }

    isDiscountVoucherProduct(product) {
        return product?.specialEffect == "discountVoucher";
    }

    getRandomProduct() {
        const index = Math.floor(Math.random() * this.getTotalAmountOfProducts());
        return this.findByIndex(index); //.products[index];
    }
}
