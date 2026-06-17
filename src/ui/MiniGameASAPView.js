import {appSettings} from "../settings.js";
import {createCoinAmountHtml} from "../utils/formatters.js";

export class MiniGameASAPView {
    constructor(elements) {
        this.dialog = elements.miniGameAsapDialog;
        this.startButton = elements.miniGameAsapStartButton;
        this.score = elements.miniGameAsapScore;
        this.timerBar = elements.miniGameAsapTimerBar;
        this.targetImage = elements.miniGameAsapTargetImage;
        this.targetName = elements.miniGameAsapTargetName;
        this.targetMeta = elements.miniGameAsapTargetMeta;
        this.miniGameAsapFinalScore = elements.miniGameAsapFinalScore;
        this.miniGameAsapFinishedDialog = elements.miniGameAsapFinishedDialog;

        this.currentProduct = null;
        this.scoreCount = 0;
        this.timerId = null;
        this.startedAt = null;
        this.durationMs = appSettings.miniGameDurationSeconds * 1000;
    }

    open() {
        this.scoreCount = 0;
        this.updateScore();
        this.timerBar.style.transform = "scaleX(1)";
        this.dialog.showModal();
        this.startTimer();
    }

    isOpen() {
        return this.dialog.open;
    }

    close() {
        clearInterval(this.timerId);
        this.timerId = null;
        this.dialog.close();
    }

    setTargetProduct(product) {
        this.currentProduct = product;
        this.targetImage.src = product.image;
        this.targetImage.alt = product.name;
        this.targetName.textContent = product.name;
        this.targetMeta.innerHTML = `
        ${createCoinAmountHtml(product.price)}
        <span>each · ${product.category}</span>
    `;
    }

    isCorrectProduct(product) {
        return this.currentProduct && product.id === this.currentProduct.id;
    }

    increaseScore() {
        this.scoreCount += 1;
        this.updateScore();

        this.score.parentElement.classList.remove("is-pulsing");
        void this.score.parentElement.offsetWidth;
        this.score.parentElement.classList.add("is-pulsing");
    }

    updateScore() {
        this.score.textContent = this.scoreCount;
    }

    startTimer(onTimeUp) {
        this.startedAt = Date.now();

        clearInterval(this.timerId);

        this.timerId = setInterval(() => {
            const elapsed = Date.now() - this.startedAt;
            const progress = Math.max(0, 1 - elapsed / this.durationMs);

            this.timerBar.style.transform = `scaleX(${progress})`;

            if (progress <= 0) {
                clearInterval(this.timerId);
                this.timerId = null;
                onTimeUp();
            }
        }, 200);
    }

    showAlreadyPlayedMiniGameAsap() {
        this.startButton.disabled = true;
        this.startButton.textContent = "Mini game completed";
        this.startButton.classList.add("is-disabled");
    }

    showMiniGameAsapFinishedMessage() {
        this.miniGameAsapFinalScore.textContent = this.scoreCount;
        this.miniGameAsapFinishedDialog.showModal();

        setTimeout(() => {
            this.miniGameAsapFinishedDialog.close();
        }, appSettings.miniGameDurationSecondsFinishedPopupDuration * 1000);
    }

    close() {
        this.dialog.close();
    }
}
