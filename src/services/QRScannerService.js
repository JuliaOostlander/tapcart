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

    async start(preferredCameraId = null) {
        if (this.running) {
            return {status: "already-running"};
        }

        if (appSettings.forceManualCameraSelection) {
            return await this.getCameraChoiceResult();
        }

        if (preferredCameraId) {
            try {
                const result = await this.startWithCameraId(preferredCameraId);
                return result;
            } catch (error) {
                console.warn("Preferred camera could not be started. Trying automatic selection.", error);
            }
        }

        try {
            this.prepareReader();
            this.scanner = new Html5Qrcode(this.readerElementId);

            this.applyInitialScanDelay();

            await this.scanner.start(
                {facingMode: "environment"},
                this.getScannerConfig(),
                decodedText => this.handleScanSuccess(decodedText),
                () => this.handleScanFailure()
            );

            this.running = true;

            return {
                status: "started",
                cameraId: null
            };
        } catch (environmentCameraError) {
            console.warn("Could not start environment camera. Trying camera list.", environmentCameraError);
            await this.clearScannerInstance();
        }

        try {
            const cameras = await Html5Qrcode.getCameras();

            if (!cameras || cameras.length === 0) {
                throw new Error("No cameras found.");
            }

            const cameraId = this.findBestCameraIdFromList(cameras);

            if (!cameraId) {
                return {
                    status: "camera-choice-needed",
                    cameras
                };
            }

            return await this.startWithCameraId(cameraId);
        } catch (error) {
            console.error("Could not start QR scanner.", error);
            await this.clearScannerInstance();
            throw error;
        }
    }

    async startWithCameraId(cameraId) {
        if (this.running) {
            await this.stop();
        } else {
            await this.clearScannerInstance();
        }

        this.prepareReader();
        this.scanner = new Html5Qrcode(this.readerElementId);

        this.applyInitialScanDelay();
        await this.scanner.start(
            {deviceId: {exact: cameraId}},
            this.getScannerConfig(),
            decodedText => this.handleScanSuccess(decodedText),
            () => this.handleScanFailure()
        );

        this.running = true;

        return {
            status: "started",
            cameraId
        };
    }

    async getCameraChoiceResult() {
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
            throw new Error("No cameras found.");
        }

        return {
            status: "camera-choice-needed",
            cameras
        };
    }

    prepareReader() {
        const readerElement = document.getElementById(this.readerElementId);

        readerElement?.classList.remove("reader-placeholder");

        if (readerElement) {
            readerElement.innerHTML = "";
        }
    }

    getScannerConfig() {
        return {
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
    }

    findBestCameraIdFromList(devices) {
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

        return preferredCamera?.id ?? null;
    }

    async stop() {
        if (!this.scanner) return;

        if (this.running) {
            await this.scanner.stop();
        }

        await this.clearScannerInstance();
    }

    async clearScannerInstance() {
        if (!this.scanner) {
            this.running = false;
            return;
        }

        try {
            await this.scanner.clear();
        } catch (error) {
            console.warn("Scanner clear failed.", error);
        }

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

    applyInitialScanDelay() {
        const delay = appSettings.scanTimeoutMs ?? appSettings.scanTimeoutMs ?? 0;

        if (delay > 0) {
            this.pausedUntil = Date.now() + delay;
        }
    }
}
