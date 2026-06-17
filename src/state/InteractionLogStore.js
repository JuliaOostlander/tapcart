const INTERACTION_LOG_KEY = "selfScan.interactionLog";
const MAX_LOG_EVENTS = 50;

export class InteractionLogStore {
    constructor(storage = window.localStorage) {
        this.storage = storage;
        this.events = this.loadEvents();
    }

    record(eventName = {}) {
        const event = {
            eventName,
            createdAt: new Date().toISOString()
        };

        this.events.push(event);

        if (this.events.length > MAX_LOG_EVENTS) {
            this.events = this.events.slice(-MAX_LOG_EVENTS);
        }
        this.saveEvents();
    }

    getEvents() {
        return [...this.events];
    }

    clear() {
        this.events = [];
        this.saveEvents();
    }

    loadEvents() {
        try {
            return JSON.parse(this.storage.getItem(INTERACTION_LOG_KEY)) || [];
        } catch (error) {
            console.error("[InteractionLogStore] Failed to load interaction log.", error);
            return [];
        }
    }

    saveEvents() {
        this.storage.setItem(INTERACTION_LOG_KEY, JSON.stringify(this.events));
    }
}
