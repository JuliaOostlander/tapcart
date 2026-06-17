export class ScannerView {
    constructor(readerElement, toggleButton) {
        this.readerElement = readerElement;
        this.toggleButton = toggleButton;
    }

    showRunning() {
        this.toggleButton.textContent = "Stop scanner";
    }

    showStopped() {
        this.toggleButton.textContent = "Start scanner";
        this.readerElement.innerHTML = `
      <div class="scanner-idle">
        <div class="scanner-icon">▦</div>
        <p>Scanner is off</p>
      </div>
    `;
    }
}
