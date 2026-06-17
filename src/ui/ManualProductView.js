/*
    FOR TESTING PURPOSES, LATER TO BE REMOVED!
    Provides a list of items to select through the app itself, not by actually scanning product (i.e. shortcut)

    */

export class ManualProductView {
  constructor(selectElement) {
    this.selectElement = selectElement;
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
