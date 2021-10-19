import Events from "./Events";

// The two types of data that can be emitted.
export type ListenerData = {
	path: string[];
	value?: object;
};
export type EventStack = {
	event: keyof typeof Events;
	path: string[];
	value?: any;
}[];

// If the event type is Events.BULK, the listener will receive an EventStack.
// Otherwise it'll receive a ListenerData object.
export type ListenerReceive<EventType> = EventType extends Events.BULK
	? EventStack
	: ListenerData;
export type ListenerFunction<EventType> = (
	event: keyof typeof Events,
	data: ListenerReceive<EventType>
) => void;

// How the listeners are stored.
export type EmitterListeners = {
	[event in Events as string]: Set<ListenerFunction<any>>;
};

export type EmitterOptions = {};

export default class EventEmitter {
	options: EmitterOptions = {};
	listeners = Object.values(Events).reduce<EmitterListeners>(
		(acc, val: string) => ((acc[val] = new Set<ListenerFunction<any>>()), acc),
		{}
	);

	constructor(options: EmitterOptions = {}) {
		Object.assign(this.options, options);
	}

	on<EventType extends keyof typeof Events>(
		event: EventType,
		listener: ListenerFunction<EventType>
	) {
		if (this.listeners[event].has(listener)) {
			throw Error(`This listener on ${event as string} already exists.`);
		}
		this.listeners[event].add(listener);
	}

	once<EventType extends keyof typeof Events>(
		event: EventType,
		listener: ListenerFunction<EventType>
	) {
		const onceListener: ListenerFunction<EventType> = (event, data) => {
			this.off(event, onceListener);
			listener(event, data);
		};
		this.on(event, onceListener);
	}

	off<EventType extends keyof typeof Events>(
		event: EventType,
		listener: ListenerFunction<EventType>
	) {
		this.listeners[event].delete(listener);
	}

	emit<EventType extends keyof typeof Events>(
		event: keyof typeof Events,
		data: ListenerReceive<EventType>
	) {
		for (const listener of this.listeners[event]) {
			listener(event, data);
		}
	}
}
