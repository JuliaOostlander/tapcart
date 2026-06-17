export class QRGeneratorService {
    generate(element, text) {
        element.innerHTML = "";

        //imported in index.html from https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js
        new QRCode(element, {
            text,
            width: 220,
            height: 220,
            correctLevel: QRCode.CorrectLevel.M
        });
    }
}
