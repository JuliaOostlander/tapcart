import {appSettings} from "../settings.js";

export class QRScannerService {
    constructor(readerElementId, onProductScanned) {
        this.readerElementId = readerElementId;
        this.onProductScanned = onProductScanned;
        this.scanner = null;
        this.running = false;
        this.lastScan = {text: "", time: 0};
    }

    isRunning() {
        return this.running;
    }

    start() {
        if (this.running) return;

        //imported in index.html from https://unpkg.com/html5-qrcode
        this.scanner = new Html5QrcodeScanner(this.readerElementId, {
            fps: 10,
            qrbox: {width: 240, height: 240},
            rememberLastUsedCamera: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        });

        this.scanner.render(
            decodedText => this.handleScanSuccess(decodedText),
            () => this.handleScanFailure()
        );

        this.running = true;
    }

    async stop() {
        if (!this.scanner) return;

        await this.scanner.clear();
        this.scanner = null;
        this.running = false;
    }

    handleScanSuccess(decodedText) {
        const now = Date.now();
        const sameRecentScan = decodedText === this.lastScan.text && now - this.lastScan.time < appSettings.scanCooldownMs;
        if (sameRecentScan) return;

        this.lastScan = {text: decodedText, time: now};
        this.onProductScanned(decodedText.trim());
    }

    handleScanFailure() {
        // Ignore frequent scan failures. They happen naturally while the camera is searching.
    }
}
