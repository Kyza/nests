import { Set } from "typescript";
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
	#listeners: ListenerObject = Object.values(NestEvents).reduce<ListenerObject>(
		(acc, val: string) => ((acc[val] = new Set<Listener>()), acc),
		{}
	);

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
		this.#listeners[event].delete(listener);
	}

	emit(event: string, data: ListenerData) {
		// Apparently Sets with their type specified aren't iterable according to TS.
		// @ts-ignore
		for (const listener of this.#listeners[event]) {
			listener(data);
		}
	}
}
