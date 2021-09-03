import NestEvents from "./NestEvents";

export type ListenerData = {
	nest: typeof Proxy;
	fullPath: string[];
	value?: any;
};

export type Listener = (data: ListenerData) => any;

export type ListenerObject = {
	[event: string]: Set<Listener>;
};

export default class EventEmitter {
	#listeners: ListenerObject = (() => {
		const obj: ListenerObject = {};
		for (const event of Object.values(NestEvents)) {
			obj[event] = new Set();
		}
		return obj;
	})();

	on(event: string, listener: Listener) {
		if (this.#listeners[event].has(listener)) {
			throw Error(`This listener on ${event} already exists.`);
		}
		this.#listeners[event].add(listener);
	}

	once(event: string, listener: Listener) {
		const onceListener = (data: ListenerData) => {
			this.off(event, onceListener);
			listener(data);
		};
		this.on(event, onceListener);
	}

	off(event: string, listener: Listener) {
		if (this.#listeners[event].has(listener)) {
			this.#listeners[event].delete(listener);
		}
	}

	emit({ event, data }: { event: string; data: ListenerData }) {
		for (const listener of this.#listeners[event]) {
			listener(data);
		}
	}
}
