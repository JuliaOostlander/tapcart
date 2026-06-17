import {formatCoins, createCoinAmountHtml} from "../utils/formatters.js";

export class CartView {
    constructor(els, callbacks) {
        this.els = els;
        this.callbacks = callbacks;
    }

    render(hydratedItems) {
        if (hydratedItems.length === 0) {
            this.els.cartItems.innerHTML = `<div class="empty-state">Your scanned products will appear here</div>`;
        } else {
            this.els.cartItems.innerHTML = hydratedItems.map(item => this.createCartItemHtml(item)).join("");
        }

        this.bindCartItemEvents();
        this.updateTotals(hydratedItems);
    }

    createCartItemHtml(item) {
        const isGiftItem = item.specialEffect === "easterEgg";

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

            <div class="quantity-controls ${isGiftItem ? "is-disabled" : ""}">
                <button
                    class="button quantity-button"
                    data-action="decrease"
                    data-product-id="${item.id}"
                    ${isGiftItem ? "disabled" : ""}
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
                    ${isGiftItem ? "disabled" : ""}
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
        this.els.cartItems.querySelectorAll("[data-open-product]").forEach(button => {
            button.addEventListener("click", event => {
                if (event.target.matches("[data-remove-product]")) return;
                this.callbacks.onOpenProduct(button.dataset.openProduct);
            });
        });

        this.els.cartItems.querySelectorAll("[data-remove-product]").forEach(button => {
            button.addEventListener("click", event => {
                if (button.dataset.disabled) {
                    return;
                }
                event.stopPropagation();
                this.callbacks.onRemoveProduct(button.dataset.removeProduct);
            });
        });

        this.els.cartItems.querySelectorAll("[data-action]").forEach(button => {
            button.addEventListener("click", event => {
                if (button.dataset.disabled) {
                    return;
                }

                const action = button.dataset.action;
                const productId = button.dataset.productId;

                if (action === "increase") {
                    this.callbacks.onChangeQuantity(productId, 1);
                }

                if (action === "decrease") {
                    this.callbacks.onChangeQuantity(productId, -1);
                }
            });
        });
    }

    updateTotals(hydratedItems) {
        const count = hydratedItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = hydratedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        this.els.cartCount.textContent = `${count} ${count === 1 ? "product" : "products"}`;
        this.els.cartTotal.innerHTML = createCoinAmountHtml(total);
    }
}
