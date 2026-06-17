export class QRParserService {
    parse(scannedText) {
        if (!scannedText || typeof scannedText !== "string") {
            return null;
        }

        return scannedText.trim();
    }
}
