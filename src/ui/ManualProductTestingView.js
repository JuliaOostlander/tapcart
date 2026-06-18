/*
    FOR TESTING PURPOSES, LATER TO BE REMOVED!
    Provides a list of items to select through the app itself, not by actually scanning product (i.e. shortcut)

    */
export class ManualProductTestingView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.addButton = elements.manualAdd;

        this.selectElement = elements.manualProduct;
    }

    bindEvents() {
        this.addButton.addEventListener("click", () => {
            const productId = this.getSelectedProductId();

            if (!productId) return;

            this.handlers.onAddProduct?.(productId);
        });
    }

    render(products) {
        this.selectElement.innerHTML = products
            .map(product => `<option value="${product.id}">${product.name}</option>`)
            .join("");
    }

    getSelectedProductId() {
        return this.selectElement.value;
    }
}
