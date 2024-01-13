const GameEvent = {
    System: 'system',
    End: 'gameEnd',
    Start: 'gameStart',
};


class EventMessage {
    /**
     * 
     * @param {string} from 
     * @param {string} value
     */
    constructor(from, value) {
        this.from = from;
        this.value = value;

        Object.freeze(this);
    }
}


class GameEventNotifier {
    #ws;
    #listeners;
    constructor() {
        this.#listeners = [];
        this.setupWebSocket();
    }

    setupWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        this.#ws = new WebSocket(`${protocol}//${host}/ws`);

        this.#ws.onopen = () => {
            console.log('WebSocket connected');
        }

        this.#ws.onmessage = async (msg) => {
            // We are parsing and sending on the backend, so its already an array
            const event = JSON.parse(msg.data);
            this.notify(event);
        }

        // reconnect on close
        this.#ws.onclose = () => {
            console.log('WebSocket closed');
            this.setupWebSocket();
        }
    }

    /**
     * subscribe to the notifier
     * @param {() => void} listener 
     */
    subscribe(listener) {
        this.#listeners.push(listener);
    }

    /**
     * unsubscribe from the notifier
     * @param {() => void} listener 
     */
    unsubscribe(listener) {
        this.#listeners = this.#listeners.filter(l => l !== listener);
    }

    /**
     * 
     * @param {EventMessage} event 
     */
    notify(event) {
        this.#listeners.forEach(listener => listener(event));
    }

    close() {
        this.#ws.close();
    }

    /**
     * Broadcasts an event to all clients
     * @param {string} from 
     * @param {string} value 
     */
    broadcast(from, value) {
        if (this.#ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket not open');
            return;
        }
        this.#ws.send(JSON.stringify(new EventMessage(from, value)));
    }
}

const notifier = new GameEventNotifier();

export { notifier, GameEvent, EventMessage };