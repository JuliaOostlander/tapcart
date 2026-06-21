export class ScannerView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.readerMainPage = elements.reader;
        this.toggleButtonMainPage = elements.toggleScanner;
    }

    bindEvents() {
        this.toggleButtonMainPage.addEventListener("click", () => {
            this.handlers.onToggle?.();
        });
    }

    showRunning() {
        this.toggleButtonMainPage.textContent = "Stop scanner";
        this.toggleButtonMainPage.classList.add("is-running");
        this.toggleButtonMainPage.innerHTML = `
            <i class="cil-media-stop" aria-hidden="true"></i>
            <span>Stop</span>
        `;
        this.readerMainPage.classList.remove("reader-placeholder");
    }

    showStopped() {
        this.toggleButtonMainPage.textContent = "Start scanner";
        this.toggleButtonMainPage.classList.remove("is-running");
        this.toggleButtonMainPage.innerHTML = `
            <i class="cil-media-play" aria-hidden="true"></i>
            <span>Start</span>
        `;

        this.readerMainPage.classList.add("reader-placeholder");

        this.readerMainPage.innerHTML = `
            <div class="scanner-idle">
                <div class="scanner-icon">▦</div>
                <p>Scanner is off</p>
            </div>
        `;
    }
}
