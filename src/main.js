//core
import {els} from "./dom.js";
import {appSettings, startOptionalRemoteSettingsListener} from "./settings.js";
import {dataSources} from "./settings.js";

//services
import {CheckoutService} from "./services/CheckoutService.js";
import {ProductService} from "./services/ProductService.js";
import {QRGeneratorService} from "./services/QRGeneratorService.js";
import {QRScannerService} from "./services/QRScannerService.js";
import {QRParserService} from "./services/QRParserService.js";

//states
import {CartStore} from "./state/CartStore.js";
import {InteractionLogStore} from "./state/InteractionLogStore.js";
import {LanguageStore} from "./state/LanguageStore.js";

//views
import {CartView} from "./ui/CartView.js";
import {CheckoutView} from "./ui/CheckoutView.js";
import {DiscountCelebrationView} from "./ui/DiscountCelebrationView.js";
import {GiftCelebrationView} from "./ui/GiftCelebrationView.js";
import {ManualProductTestingView} from "./ui/ManualProductTestingView.js";
import {MiniGameFastScanPopupView} from "./ui/MiniGameFastScanPopupView.js";
import {PageView} from "./ui/PageView.js";
import {ProductDetailsPopupView} from "./ui/ProductDetailsPopupView.js";
import {ScannerView} from "./ui/ScannerView.js";
import {ScannedItemPopupView} from "./ui/ScannedItemPopupView.js";
import {AddedToCartFeedbackPopupView} from "./ui/AddedToCartFeedbackPopupView.js";
import {SideMenuView} from "./ui/SideMenuView.js";
import {ToastView} from "./ui/ToastView.js";

class TapCart {
    constructor() {
        this.createServices();
        this.createStores();
        this.createViews();

        this.state = this.createInitialState();
    }

    createInitialState() {
        return {
            hasPlayedMiniGameFastScan: false,
            isMiniGameFastScanActive: false,
            scannerLockCount: 0,
            scannerResumeTimeoutId: null,
            language: this.languageStore.getLanguage(),
            selectedCameraId: localStorage.getItem("tapcartCameraId"),
            hasScannedDiscountVoucher: false
        };
    }

    createViews() {
        this.addedToCartFeedbackPopupView = new AddedToCartFeedbackPopupView(els, {
            onClose: () => this.unlockScanners()
        });

        this.cartView = new CartView(els, {
            onOpenProduct: productId => this.openProductView(productId),
            onRemoveProduct: productId => this.removeProduct(productId),
            onChangeQuantity: (productId, delta) => this.changeQuantity(productId, delta),
            onClearCart: () => this.clearCart()
        });

        this.checkoutView = new CheckoutView(els, this.qrGeneratorService, {
            onClose: () => this.unlockScanners(),
            onConfirm: () => this.generateCheckoutQr()
        });

        this.discountCelebrationView = new DiscountCelebrationView(els);

        this.giftCelebrationView = new GiftCelebrationView(els);

        this.manualProductTestingView = new ManualProductTestingView(els, {
            onAddProduct: productId => this.confirmAddProduct(productId)
        });

        this.miniGameFastScanView = new MiniGameFastScanPopupView(els);

        this.pageView = new PageView(els);

        this.productDetailsPopupView = new ProductDetailsPopupView(els, {
            onClose: () => this.unlockScanners()
        });

        this.scannedItemPopupView = new ScannedItemPopupView(els, {
            onClose: () => this.unlockScanners(),

            onConfirm: product => this.handleScannedItemConfirmed(product),

            onDetails: product => {
                this.lockScanners();
                this.productDetailsPopupView.open(product);
            }
        });

        this.scannerView = new ScannerView(els, {
            onToggle: () => this.toggleScanner(),
            onCameraSelected: cameraId => this.handleMainCameraSelected(cameraId)
        });

        this.sideMenuView = new SideMenuView(els, {
            onHome: () => this.pageView.showHome(),
            onSettings: () => this.pageView.showSettings(),
            onManualTesting: () => this.pageView.showManualTesting(),
            onMiniGameFastScan: () => this.pageView.showMiniGameFastScan(),
            onAbout: () => this.pageView.showAbout()
        });

        this.toastView = new ToastView(els.toast);
    }

    createServices() {
        this.checkoutService = new CheckoutService();
        this.miniGameFastScanScannerService = new QRScannerService(
            "mini-game-fast-scan-reader",
            scannedText => this.handleQrScan(scannedText)
        );
        this.miniGameProductService = new ProductService(dataSources.miniGameFastScanProducts);
        this.productService = new ProductService(dataSources.products);
        this.qrGeneratorService = new QRGeneratorService();
        this.qrParserService = new QRParserService();
        this.scannerService = new QRScannerService(
            "reader",
            scannedText => this.handleQrScan(scannedText)
        );
    }

    createStores() {
        this.cartStore = new CartStore();
        this.interactionLogStore = new InteractionLogStore();
        this.languageStore = new LanguageStore();
    }

    async init() {
        this.setFooterYear();
        els.languageSelect.value = this.state.language;

        await this.productService.loadProducts();
        await this.miniGameProductService.loadProducts();

        this.bindEvents();

        this.render();

        startOptionalRemoteSettingsListener();
    }

    render() {
        this.manualProductTestingView.render(this.productService.getAllProducts());
        this.renderCart();
    }

    bindEvents() {
        this.cartView.bindEvents();
        this.checkoutView.bindEvents();
        this.discountCelebrationView.bindEvents();
        this.manualProductTestingView.bindEvents();
        this.productDetailsPopupView.bindEvents();
        this.scannedItemPopupView.bindEvents();
        this.scannerView.bindEvents();
        this.sideMenuView.bindEvents();

        els.checkoutButton.addEventListener("click", () => {
            this.openCheckout();
        });

        els.miniGameFastScanStartButton.addEventListener(
            "click",
            () => this.startMiniGameFastScan()
        );

        els.languageSelect.addEventListener("change", event => {
            this.languageStore.setLanguage(event.target.value);
            this.toastView.show("Language saved");
        });

        els.navbarHomeButton.addEventListener(
            "click",
            () => this.pageView.showHome()
        );
    }

    handleQrScan(scannedText) {
        const productId = this.qrParserService.parse(scannedText);

        if (!productId) {
            this.toastView.show("Invalid QR code");
            return;
        }

        if (this.miniGameFastScanView.isOpen()) {
            this.handleMiniGameFastScanProductScan(productId);
            return;
        }

        this.handleNormalProductScan(productId);
    }

    handleNormalProductScan(productId) {
        const product = this.productService.findById(productId);

        if (!product) {
            this.toastView.show(`Unknown product: ${productId}`);
            this.interactionLogStore.record("unknown_product_scanned", {productId});
            return;
        }

        this.lockScanners();
        this.scannedItemPopupView.open(product);
    }

    handleMiniGameFastScanProductScan(productId) {
        const product = this.miniGameProductService.findById(productId);

        if (!product) {
            this.toastView.show("Unknown product, not part of the mini game");
            return;
        }
        this.lockScanners();
        this.scannedItemPopupView.open(product);
    }

    lockScanners() {
        window.clearTimeout(this.state.scannerResumeTimeoutId);
        this.state.scannerLockCount += 1;

        if (this.scannerService.isRunning()) {
            this.scannerService.pause();
        }

        if (this.miniGameFastScanScannerService.isRunning()) {
            this.miniGameFastScanScannerService.pause();
        }
    }

    unlockScanners() {
        this.state.scannerLockCount = Math.max(0, this.state.scannerLockCount - 1);

        if (this.state.scannerLockCount > 0) return;

        window.clearTimeout(this.state.scannerResumeTimeoutId);

        this.state.scannerResumeTimeoutId = window.setTimeout(() => {
            if (this.scannerService.isRunning()) {
                this.scannerService.resume();
            }

            if (this.miniGameFastScanScannerService.isRunning()) {
                this.miniGameFastScanScannerService.resume();
            }
        }, appSettings.scanTimeoutMs);
    }

    handleScannedItemConfirmed(product) {
        if (this.miniGameFastScanView.isOpen() || this.state.isMiniGameFastScanActive) {
            if (!this.state.isMiniGameFastScanActive) return;

            if (!this.miniGameFastScanView.isCorrectProduct(product)) {
                this.toastView.show("Wrong product — try again");
                this.lockScanners();
                this.addedToCartFeedbackPopupView.showWrongProduct();

                return;
            }

            this.lockScanners();
            this.addedToCartFeedbackPopupView.showProductAdded(product);

            this.miniGameFastScanView.increaseScore();
            this.miniGameFastScanView.setTargetProduct(
                this.miniGameProductService.getRandomProduct()
            );
            return;
        }

        this.addProductById(product);
    }

    async startMiniGameFastScan() {
        this.state.isMiniGameFastScanActive = true;

        if (this.state.hasPlayedMiniGameFastScan) return;

        if (this.scannerService.isRunning()) {
            await this.scannerService.stop();
            this.scannerView.showStopped();
        }

        this.miniGameFastScanView.open();
        this.miniGameFastScanView.setTargetProduct(
            this.miniGameProductService.getRandomProduct()
        );

        this.miniGameFastScanScannerService.resume();

        try {
            if (this.state.selectedCameraId) {
                await this.miniGameFastScanScannerService.startWithCameraId(this.state.selectedCameraId);
            } else {
                const result = await this.miniGameFastScanScannerService.start();

                if (result?.cameraId) {
                    this.saveSelectedCameraId(result.cameraId);
                }

                if (result?.status === "camera-choice-needed") {
                    this.toastView.show("Start the main scanner first to choose a camera");
                    await this.endMiniGame();
                    return;
                }
            }

            this.miniGameFastScanView.startTimer(() => this.endMiniGame());
        } catch (error) {
            console.error(error);
            this.toastView.show("Could not start mini game scanner");
            await this.endMiniGame();
        }
    }

    async endMiniGame() {
        this.state.isMiniGameFastScanActive = false;

        if (this.scannedItemPopupView.isOpen()) {
            this.scannedItemPopupView.close();
        }
        if (this.productDetailsPopupView.isOpen()) {
            this.productDetailsPopupView.close();
        }

        this.state.hasPlayedMiniGameFastScan = true;
        this.miniGameFastScanView.showAlreadyPlayedMiniGameFastScan();

        if (this.miniGameFastScanScannerService.isRunning()) {
            await this.miniGameFastScanScannerService.stop();
        }

        this.miniGameFastScanScannerService.resume();
        this.miniGameFastScanView.close();
        this.miniGameFastScanView.showMiniGameFastScanFinishedMessage();
    }

    async toggleScanner() {
        if (this.scannerService.isRunning()) {
            await this.scannerService.stop();
            this.scannerView.showStopped();
            return;
        }

        this.scannerView.showStarting();

        try {
            const result = await this.scannerService.start(this.state.selectedCameraId);

            this.scannerView.hideStarting();

            if (result.status === "started" || result.status === "already-running") {
                if (result.cameraId) {
                    this.saveSelectedCameraId(result.cameraId);
                }

                this.scannerView.hideCameraOptions();
                this.scannerView.showRunning();
                return;
            }

            if (result.status === "camera-choice-needed") {
                this.scannerView.showCameraOptions(result.cameras);
                this.scannerView.showCameraChoiceNeeded();
                return;
            }
        } catch (error) {
            console.error(error);

            this.scannerView.hideStarting();
            this.scannerView.showStopped();
            this.toastView.show("Could not start camera");
        }
    }

    async handleMainCameraSelected(cameraId) {
        this.scannerView.showStarting();

        try {
            const result = await this.scannerService.startWithCameraId(cameraId);

            this.saveSelectedCameraId(result.cameraId);

            this.scannerView.selectCamera(result.cameraId);
            this.scannerView.hideStarting();
            this.scannerView.showRunning();
        } catch (error) {
            console.error(error);

            this.scannerView.hideStarting();
            this.scannerView.showCameraChoiceNeeded();
            this.toastView.show("Could not start selected camera");
        }
    }

    saveSelectedCameraId(cameraId) {
        if (!cameraId) return;

        this.state.selectedCameraId = cameraId;
        localStorage.setItem("tapcartCameraId", cameraId);
    }

    confirmAddProduct(productId) {
        const product = this.productService.findById(productId);

        if (!product) {
            this.toastView.show(`Unknown product: ${productId}`);
            this.interactionLogStore.record("unknown_product_scanned", {productId});
            return;
        }

        this.lockScanners();
        this.scannedItemPopupView.open(product);
    }

    addProductById(product) {
        this.cartStore.addProduct(product);

        this.renderCart();

        if (this.productService.isGiftProduct(product)) {
            this.lockScanners();
            this.giftCelebrationView.show();
            return;
        }
        if (this.productService.isDiscountVoucherProduct(product)) {
            if(this.hasScannedDiscountCard){
                this.toastView.show("Already added discount card");
                this.lockScanners();
                this.addedToCartFeedbackPopupView.showAlreadyAddedDiscountCard();
                return;
            } else{
                this.hasScannedDiscountCard = true;
                this.lockScanners();
                this.discountCelebrationView.show();
                return;
            }

        }
        this.lockScanners();
        this.addedToCartFeedbackPopupView.showProductAdded(product);
    }

    changeQuantity(productId, delta) {
        this.cartStore.changeQuantity(productId, delta);
        this.renderCart();
    }

    removeProduct(productId) {
        this.cartStore.removeItem(productId);
        this.renderCart();
    }

    clearCart() {
        this.cartStore.clearChart();
        this.renderCart();
    }

    openProductView(productId) {
        const product = this.productService.findById(productId);
        this.lockScanners();
        this.productDetailsPopupView.open(product);
    }

    renderCart() {
        const hydratedItems = this.productService.hydrateCartItems(this.cartStore.getItems());
        this.cartView.render(hydratedItems);
    }

    setFooterYear() {
        els.footerYear.textContent = String(new Date().getFullYear());
    }

    openCheckout() {
        const cartItems = this.cartStore.getItems();

        if (cartItems.length === 0) {
            this.toastView.show("Your cart is empty");
            return;
        }

        const totalPrice = this.cartStore.getTotalPrice(this.productService.getProductsById());

        this.lockScanners();
        this.checkoutView.open(cartItems, totalPrice);
    }

    generateCheckoutQr() {
        const qrString = this.checkoutService.createCheckoutQrString(
            this.cartStore.getItems(),
            this.interactionLogStore.getEvents()
        );

        this.checkoutView.showQrCode(qrString);
    }
}

const app = new TapCart();
app.init();
