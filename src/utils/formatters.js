import {appSettings} from "../settings.js";

export function formatMoney(value) {
    return new Intl.NumberFormat(appSettings.locale, {
        style: "currency",
        currency: appSettings.currency
    }).format(value);
}

export function formatCoins(value) {
    return Number(value).toFixed(2);
}

export function createCoinAmountHtml(value) {
    return `
        <span class="coin-price">
            <i class="cil-money coin-icon" aria-hidden="true"></i>
            <span>${formatCoins(value)}</span>
        </span>
    `;
}
