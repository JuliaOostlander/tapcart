import {appSettings} from "../settings.js";

export class QRScannerService {
    constructor(readerElementId, onProductScanned) {
        this.readerElementId = readerElementId;
        this.onProductScanned = onProductScanned;
        this.scanner = null;
        this.running = false;
        this.lastScan = {text: "", time: 0};
        this.paused = false;
        this.pausedUntil = 0;
    }

    isRunning() {
        return this.running;
    }

    async start() {
        if (this.running) return;

        const readerElement = document.getElementById(this.readerElementId);
        readerElement?.classList.remove("reader-placeholder");
        if (readerElement) readerElement.innerHTML = "";

        this.scanner = new Html5Qrcode(this.readerElementId);

        const config = {
            fps: 10,

            qrbox: (viewfinderWidth, viewfinderHeight) => {
                const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                const size = Math.min(200, Math.floor(minEdge * 0.7));

                return {
                    width: size,
                    height: size
                };
            },

            aspectRatio: window.innerWidth >= 700 ? 1.7777778 : 1.0
        };

        try {
            // Prefer the rear camera.
            await this.scanner.start(
                {facingMode: "environment"},
                config,
                decodedText => this.handleScanSuccess(decodedText),
                () => this.handleScanFailure()
            );

            this.running = true;
        } catch (environmentCameraError) {
            console.warn("Could not start environment camera. Trying fallback camera.", environmentCameraError);

            try {
                const cameraId = await this.findBestCameraId();

                if (!cameraId) {
                    throw new Error("No camera found.");
                }

                await this.scanner.start(
                    {deviceId: {exact: cameraId}},
                    config,
                    decodedText => this.handleScanSuccess(decodedText),
                    () => this.handleScanFailure()
                );

                this.running = true;
            } catch (fallbackError) {
                console.error("Could not start QR scanner.", fallbackError);
                this.scanner = null;
                this.running = false;
                throw fallbackError;
            }
        }
    }

    async findBestCameraId() {
        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
            return null;
        }

        const backCameraWords = [
            "back",
            "rear",
            "environment",
            "world",
            "achter",
            "trás",
            "arrière",
            "rück"
        ];

        const preferredCamera = devices.find(device => {
            const label = device.label.toLowerCase();
            return backCameraWords.some(word => label.includes(word));
        });

        return preferredCamera?.id ?? devices[devices.length - 1].id;
    }

    async stop() {
        if (!this.scanner) return;

        if (this.running) {
            await this.scanner.stop();
        }

        await this.scanner.clear();

        this.scanner = null;
        this.running = false;
    }

    handleScanSuccess(decodedText) {
        if (this.isPaused()) return;

        const now = Date.now();
        const sameRecentScan =
            decodedText === this.lastScan.text &&
            now - this.lastScan.time < appSettings.scanCooldownMs;

        if (sameRecentScan) return;

        this.lastScan = {text: decodedText, time: now};
        this.onProductScanned(decodedText.trim());
    }

    handleScanFailure() {
        // Ignore frequent scan failures. They happen naturally while the camera is searching.
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        this.pausedUntil = 0;
    }

    pauseFor(milliseconds) {
        this.paused = false;
        this.pausedUntil = Date.now() + milliseconds;
    }

    isPaused() {
        return this.paused || Date.now() < this.pausedUntil;
    }
}
