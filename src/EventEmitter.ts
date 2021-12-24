import Events from "./Events.js";

// The types of data that can be emitted.
export type ListenerData = {
	event: keyof typeof Events;
	path: (string | symbol)[];
};
export type SetListenerData = {
	value: object;
} & ListenerData;
export type DeleteListenerData = ListenerData;
export type ApplyListenerData = {
	thisArg: object;
	args: any[];
	value: object;
} & ListenerData;
export type BulkListenerData = ({
	value?: any;
} & (SetListenerData | DeleteListenerData | ApplyListenerData))[];

// If the event type is Events.BULK, the listener will receive an EventStack.
// Otherwise it'll receive a ListenerData object.
export type ListenerReceive<EventType> = EventType extends Events.BULK
	? BulkListenerData
	: EventType extends Events.SET
	? SetListenerData
	: EventType extends Events.DELETE
	? DeleteListenerData
	: EventType extends Events.APPLY
	? ApplyListenerData
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
