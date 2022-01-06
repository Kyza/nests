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
		events: EventType | EventType[],
		listener: ListenerFunction<EventType>
	) {
		const single = (event: EventType) => {
			if (this.listeners[event].has(listener)) {
				throw Error(`This listener on ${event as string} already exists.`);
			}
			this.listeners[event].add(listener);
		};
		if (Array.isArray(events)) {
			for (const event of events) {
				single(event);
			}
		} else {
			single(events);
		}
	}

	once<EventType extends keyof typeof Events>(
		events: EventType | EventType[],
		listener: ListenerFunction<EventType>
	) {
		const onceListener: ListenerFunction<EventType> = (data) => {
			this.off(events, onceListener);
			listener(data);
		};

		this.on(events, onceListener);
	}

	off<EventType extends keyof typeof Events>(
		events: EventType | EventType[],
		listener: ListenerFunction<EventType>
	) {
		if (Array.isArray(events)) {
			for (const event of events) {
				this.listeners[event].delete(listener);
			}
		} else {
			this.listeners[events].delete(listener);
		}
	}

	emit<EventType extends keyof typeof Events>(
		event: keyof typeof Events,
		data: ListenerReceive<EventType>
	) {
		for (const listener of this.listeners[event]) {
			listener(data);
		}
	}
}
