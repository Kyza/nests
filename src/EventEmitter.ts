import Events from "./Events";

export type ListenerData = {
	path: string[];
	value?: any;
};

export type ListenerEventDataFunction = (
	event: keyof Event | string,
	data: ListenerData | any
) => any;
export type ListenerDataFunction = (data: ListenerData | any) => any;

export type ListenerObject = {
	[event: string]: Set<ListenerEventDataFunction>;
};

export default class EventEmitter {
	constructor() {
		for (const event of Object.values(Events)) {
			this[event.toLowerCase()] = (data: ListenerData | any) => {
				this.emit(event as keyof Event, data);
			};
		}
	}

	get: ListenerDataFunction;
	set: ListenerDataFunction;
	delete: ListenerDataFunction;
	update: ListenerDataFunction;

	listeners: ListenerObject = Object.values(Events).reduce<ListenerObject>(
		(acc, val: string) => (
			(acc[val] = new Set<ListenerEventDataFunction>()), acc
		),
		{}
	);

	on: ListenerEventDataFunction = function (
		event: string,
		listener: ListenerEventDataFunction
	) {
		if (this.listeners[event].has(listener)) {
			throw Error(`This listener on ${event} already exists.`);
		}
		this.listeners[event].add(listener);
	};

	once: ListenerEventDataFunction = function (
		event: string,
		listener: ListenerEventDataFunction
	) {
		const onceListener: ListenerEventDataFunction = (event, data) => {
			this.off(event, onceListener);
			listener(event, data);
		};
		this.on(event, onceListener);
	};

	off: ListenerEventDataFunction = function (
		event: string,
		listener: ListenerEventDataFunction
	) {
		this.listeners[event].delete(listener);
	};

	emit: ListenerEventDataFunction = function (event, data) {
		for (const listener of this.listeners[event]) {
			listener(event, data);
		}
	};
}
