export class ScannerView {
    constructor(elements, handlers = {}) {
        this.handlers = handlers;

        this.readerMainPage = elements.reader;
        this.toggleButtonMainPage = elements.toggleScanner;
        this.cameraSelect = elements.cameraSelect;
    }

    bindEvents() {
        this.toggleButtonMainPage.addEventListener("click", () => {
            this.handlers.onToggle?.();
        });

        this.cameraSelect?.addEventListener("change", () => {
            const cameraId = this.cameraSelect.value;

            if (cameraId) {
                this.handlers.onCameraSelected?.(cameraId);
            }
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

    showStarting() {
        this.toggleButtonMainPage.disabled = true;

        this.toggleButtonMainPage.innerHTML = `
            <i class="cil-media-play" aria-hidden="true"></i>
            <span>Start</span>
        `;
    }

    hideStarting() {
        this.toggleButtonMainPage.disabled = false;
    }

    showCameraOptions(cameras) {
        if (!this.cameraSelect) return;

        this.cameraSelect.innerHTML = `
            <option value="">Select camera</option>
            ${cameras.map((camera, index) => `
                <option value="${camera.id}">
                    ${camera.label || `Camera ${index + 1}`}
                </option>
            `).join("")}
        `;

        this.cameraSelect.hidden = false;
    }

    hideCameraOptions() {
        if (!this.cameraSelect) return;

        this.cameraSelect.hidden = true;
    }

    showCameraChoiceNeeded() {
        this.toggleButtonMainPage.classList.remove("is-running");

        this.toggleButtonMainPage.innerHTML = `
            <i class="cil-media-play" aria-hidden="true"></i>
            <span>Start</span>
        `;

        this.readerMainPage.classList.add("reader-placeholder");

        this.readerMainPage.innerHTML = `
            <div class="scanner-idle">
                <div class="scanner-icon">▦</div>
                <p>Select a camera</p>
            </div>
        `;
    }

    selectCamera(cameraId) {
        if (!this.cameraSelect) return;

        this.cameraSelect.value = cameraId;
    }
}
