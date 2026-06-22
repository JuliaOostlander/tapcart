import {formatCoins, createCoinAmountHtml, createDiscountedCoinAmountHtml} from "../utils/formatters.js";

export class CartView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.clearCartButton = elements.clearCart;

        this.cartItems = elements.cartItems;
        this.cartCount = elements.cartCount;
        this.totalPrice = elements.cartTotalPrice;
    }

    bindEvents() {
        this.clearCartButton.addEventListener("click", () => {
            this.handlers.onClearCart?.();
        });
    }

    render(hydratedItems) {
        if (hydratedItems.length === 0) {
            this.cartItems.innerHTML = `<div class="empty-state">Your scanned products will appear here</div>`;
        } else {
            this.cartItems.innerHTML = hydratedItems.map(item => this.createCartItemHtml(item)).join("");
        }

        this.bindCartItemEvents();
        this.updateTotals(hydratedItems);
    }

    createCartItemHtml(item) {
        const isGiftItem = item.specialEffect === "easterEgg";
        const isDiscountItem = item.specialEffect === "discountVoucher";

        return `
            <article class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <div class="cart-item-content">
                    <button type="button" data-open-product="${item.id}" class="cart-item-name">
                        <h3>${item.name}</h3>
                    </button>
                </div>
                
                <p class="cart-item-details">
                    <span class="coin-price">
                        <i class="cil-money coin-icon" aria-hidden="true"></i>
                        <span>${formatCoins(item.price)} each · ${item.category}</span>
                    </span>
                </p>
                
                <div class="quantity-controls ${isGiftItem || isDiscountItem ? "is-disabled" : ""}">
                    <button
                        class="button quantity-button"
                        data-action="decrease"
                        data-product-id="${item.id}"
                        ${isGiftItem || isDiscountItem ? "disabled" : ""}
                        type="button"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    
                    <span>${item.quantity}</span>
                    
                    <button
                        class="button quantity-button"
                        data-action="increase"
                        data-product-id="${item.id}"
                        ${isGiftItem || isDiscountItem ? "disabled" : ""}
                        type="button"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            
            </article>
            `;
    }

    bindCartItemEvents() {
        this.cartItems.querySelectorAll("[data-open-product]").forEach(button => {
            button.addEventListener("click", event => {
                if (event.target.matches("[data-remove-product]")) return;
                this.handlers.onOpenProduct(button.dataset.openProduct);
            });
        });

        this.cartItems.querySelectorAll("[data-remove-product]").forEach(button => {
            button.addEventListener("click", event => {
                if (button.dataset.disabled) {
                    return;
                }
                event.stopPropagation();
                this.handlers.onRemoveProduct(button.dataset.removeProduct);
            });
        });

        this.cartItems.querySelectorAll("[data-action]").forEach(button => {
            button.addEventListener("click", event => {
                if (button.dataset.disabled) {
                    return;
                }

                const action = button.dataset.action;
                const productId = button.dataset.productId;

                if (action === "increase") {
                    this.handlers.onChangeQuantity(productId, 1);
                }

                if (action === "decrease") {
                    this.handlers.onChangeQuantity(productId, -1);
                }
            });
        });
    }

    updateTotals(hydratedItems) {
        const count = hydratedItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = hydratedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const hasDiscountCard = hydratedItems.some(item => item.specialEffect === "discount");

        this.cartCount.textContent = `${count} ${count === 1 ? "product" : "products"}`;

        if (hasDiscountCard) {
            const discountedTotal = this.getDiscountedTotal(total);
            this.totalPrice.innerHTML = createDiscountedCoinAmountHtml(total, discountedTotal);
            return;
        }

        this.totalPrice.innerHTML = createCoinAmountHtml(total);
    }

    getDiscountedTotal(total) {
        const discountRate = 0.05;

        return total * (1 - discountRate);
    }
}
