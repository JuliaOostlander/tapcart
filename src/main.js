//core
import {els} from "./dom.js";
import {startOptionalRemoteSettingsListener} from "./settings.js";
import {dataSources} from "./settings.js";

//service
import {CheckoutService} from "./services/CheckoutService.js";
import {ProductService} from "./services/ProductService.js";
import {QRGeneratorService} from "./services/QRGeneratorService.js";
import {QRScannerService} from "./services/QRScannerService.js";
import {QRParserService} from "./services/QRParserService.js";

//state
import {CartStore} from "./state/CartStore.js";
import {InteractionLogStore} from "./state/InteractionLogStore.js";
import {LanguageStore} from "./state/LanguageStore.js";

//view
import {CartView} from "./ui/CartView.js";
import {CheckoutView} from "./ui/CheckoutView.js";
import {GiftCelebrationView} from "./ui/GiftCelebrationView.js";
import {ManualProductView} from "./ui/ManualProductView.js";
import {MiniGameASAPView} from "./ui/MiniGameASAPView.js";
import {PageView} from "./ui/PageView.js";
import {ProductDetailsPopupView} from "./ui/ProductDetailsPopupView.js";
import {ScannerView} from "./ui/ScannerView.js";
import {ScannedItemView} from "./ui/ScannedItemView.js";
import {ScanFeedbackOverlayView} from "./ui/ScanFeedbackOverlayView.js";
import {SideMenuView} from "./ui/SideMenuView.js";
import {ToastView} from "./ui/ToastView.js";

class TapCart {
    constructor() {
        this.checkoutService = new CheckoutService();
        this.productService = new ProductService(dataSources.products);
        this.miniGameProductService = new ProductService(dataSources.miniGameAsapProducts);
        this.qrGeneratorService = new QRGeneratorService();
        this.qrParserService = new QRParserService();
        this.scannerService = new QRScannerService(
            "reader",
            scannedText => this.handleQrScan(scannedText)
        );
        this.miniGameAsapScannerService = new QRScannerService(
            "mini-game-asap-reader",
            scannedText => this.handleQrScan(scannedText)
        );

        this.cartStore = new CartStore();
        this.interactionLogStore = new InteractionLogStore();
        this.languageStore = new LanguageStore();

        this.checkoutView = new CheckoutView(els, this.qrGeneratorService);
        this.giftCelebrationView = new GiftCelebrationView(els);
        this.manualProductView = new ManualProductView(els.manualProduct);
        this.miniGameAsapView = new MiniGameASAPView(els);
        this.pageView = new PageView(els);
        this.productPopupView = new ProductDetailsPopupView(els);
        this.scannerView = new ScannerView(els.reader, els.toggleScanner);
        this.scannedItemView = new ScannedItemView(els);
        this.scanFeedbackOverlayView = new ScanFeedbackOverlayView(els);
        this.sideMenuView = new SideMenuView(els);
        this.toastView = new ToastView(els.toast);
        this.cartView = new CartView(els, {
            onOpenProduct: productId => this.openProductView(productId),
            onRemoveProduct: productId => this.removeProduct(productId),
            onChangeQuantity: (productId, delta) => this.changeQuantity(productId, delta)
        });

        this.hasPlayedMiniGameAsap = false;
        this.isMiniGameAsapActive = false;
    }

    async init() {
        this.setFooterYear();
        await this.productService.loadProducts();
        await this.miniGameProductService.loadProducts();
        this.manualProductView.render(this.productService.getAllProducts());
        this.productPopupView.bindEvents();
        this.bindPageEvents();
        this.bindEvents();
        this.renderCart();
        els.languageSelect.value = this.languageStore.getLanguage();

        this.sideMenuView.bindEvents();
        startOptionalRemoteSettingsListener();
    }

    bindPageEvents() {
        els.toggleScanner.addEventListener("click", () => this.toggleScanner());
        els.manualAdd.addEventListener("click", () => this.confirmAddProduct(this.manualProductView.getSelectedProductId()));
        els.clearCart.addEventListener("click", () => this.clearCart());
    }

    bindEvents() {
        els.checkoutButton.addEventListener("click", () => {
            this.openCheckout();
        });

        els.miniGameAsapStartButton.addEventListener(
            "click",
            () => this.startMiniGameAsap()
        );

        this.checkoutView.onConfirm(() => {
            this.generateCheckoutQr();
        });

        this.scannedItemView.onConfirm(product => this.handleScannedItemConfirmed(product));

        this.scannedItemView.onDetails(product => {
            this.scannedItemView.onDetails(product => {
                this.productPopupView.open(product);
            });
        });

        els.aboutButton.addEventListener("click", () => {
            this.sideMenuView.close();
            this.pageView.showAbout();
        });

        els.homeMenuButton.addEventListener("click", () => {
            this.sideMenuView.close();
            this.pageView.showHome();
        });

        els.settingsButton.addEventListener("click", () => {
            this.sideMenuView.close();
            this.pageView.showSettings();
        });

        els.manualTestingButton.addEventListener("click", () => {
            this.sideMenuView.close();
            this.pageView.showManualTesting();
        });

        els.miniGameAsapButton.addEventListener("click", () => {
            this.sideMenuView.close();
            this.pageView.showMiniGameAsap();
        });

        els.languageSelect.addEventListener("change", event => {
            this.languageStore.setLanguage(event.target.value);
            this.toastView.show("Language saved");
        });
    }

    handleQrScan(scannedText) {
        const productId = this.qrParserService.parse(scannedText);

        if (!productId) {
            this.toastView.show("Invalid QR code");
            return;
        }

        if (this.miniGameAsapView.isOpen()) {
            this.handleMiniGameAsapProductScan(productId);
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

        this.scannedItemView.open(product);
    }

    handleMiniGameAsapProductScan(productId) {
        const product = this.miniGameProductService.findById(productId);

        if (!product) {
            this.toastView.show("Unknown product, not part of the mini game");
            return;
        }
        this.scannedItemView.open(product);
    }

    handleScannedItemConfirmed(product) {
        if (this.miniGameAsapView.isOpen() || this.isMiniGameAsapActive) {
            if (!this.isMiniGameAsapActive) return;

            if (!this.miniGameAsapView.isCorrectProduct(product)) {
                this.toastView.show("Wrong product — try again");
                this.scanFeedbackOverlayView.showWrongProduct();

                return;
            }

            this.scanFeedbackOverlayView.showProductAdded(product);

            this.miniGameAsapView.increaseScore();
            this.miniGameAsapView.setTargetProduct(
                this.miniGameProductService.getRandomProduct()
            );
            return;
        }

        this.addProductById(product);
    }

    async startMiniGameAsap() {
        this.isMiniGameAsapActive = true;

        if (this.hasPlayedMiniGameAsap) return;

        if (this.scannerService.isRunning()) {
            await this.scannerService.stop();
            this.scannerView.showStopped();
        }

        this.miniGameAsapView.open();
        this.miniGameAsapView.setTargetProduct(
            this.miniGameProductService.getRandomProduct()
        );

        this.miniGameAsapScannerService.start();
        this.miniGameAsapView.startTimer(() => this.endMiniGame());
    }

    async endMiniGame() {
        this.isMiniGameAsapActive = false;

        if (this.scannedItemView.isOpen()) {
            this.scannedItemView.close();
        }
        if (this.productPopupView.isOpen()) {
            this.productPopupView.close();
        }

        this.hasPlayedMiniGameAsap = true;
        this.miniGameAsapView.showAlreadyPlayedMiniGameAsap();

        if (this.miniGameAsapScannerService.isRunning()) {
            await this.miniGameAsapScannerService.stop();
        }

        this.miniGameAsapView.close();
        this.miniGameAsapView.showMiniGameAsapFinishedMessage();
    }


    async toggleScanner() {
        if (this.scannerService.isRunning()) {
            await this.scannerService.stop();
            this.scannerView.showStopped();
            return;
        }

        this.scannerService.start();
        this.scannerView.showRunning();
    }

    confirmAddProduct(productId) {
        const product = this.productService.findById(productId);

        if (!product) {
            this.toastView.show(`Unknown product: ${productId}`);
            this.interactionLogStore.record("unknown_product_scanned", {productId});
            return;
        }

        this.scannedItemView.open(product);
    }

    addProductById(product) {
        this.cartStore.addProduct(product);

        this.renderCart();

        if (this.productService.isGiftProduct(product)) {
            this.giftCelebrationView.show();
            return;
        }
        this.scanFeedbackOverlayView.showProductAdded(product);
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
        this.productPopupView.open(product);
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
