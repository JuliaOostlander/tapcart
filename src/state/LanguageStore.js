const LANGUAGE_STORAGE_KEY = "selfScan.language";

export class LanguageStore {
    constructor(storage = window.localStorage) {
        this.storage = storage;
    }

    getLanguage() {
        return this.storage.getItem(LANGUAGE_STORAGE_KEY) || "en";
    }

    setLanguage(language) {
        this.storage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
}