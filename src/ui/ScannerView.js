export class ScannerView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.reader = elements.reader;
        this.toggleButton = elements.toggleScanner;
    }

    bindEvents() {
        this.toggleButton.addEventListener("click", () => {
            this.handlers.onToggle?.();
        });
    }

    showRunning() {
        this.toggleButton.textContent = "Stop scanner";
    }

    showStopped() {
        this.toggleButton.textContent = "Start scanner";
        this.reader.innerHTML = `
            <div class="scanner-idle">
                <div class="scanner-icon">▦</div>
                <p>Scanner is off</p>
            </div>
        `;
    }
}
