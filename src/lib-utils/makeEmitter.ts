import Events from "../Events.js";

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
export type BulkListenerData = {
	value?: (
		| SetListenerData
		| DeleteListenerData
		| ApplyListenerData
		| BulkListenerData
	)[];
} & ListenerData;

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

export type EventEmitter = {
	listeners: EmitterListeners;
	on: <EventType extends keyof typeof Events>(
		events: EventType | EventType[],
		listener: ListenerFunction<EventType>
	) => Function;
	once: <EventType extends keyof typeof Events>(
		events: EventType | EventType[],
		listener: ListenerFunction<EventType>
	) => Function;
	off: <EventType extends keyof typeof Events>(
		events: EventType | EventType[],
		listener: ListenerFunction<EventType>
	) => void;
	emit: <EventType extends keyof typeof Events>(
		event: EventType,
		data: ListenerReceive<EventType>
	) => void;
};

export const offSymbol = Symbol("off");

export default function makeEmitter(): EventEmitter {
	return {
		listeners: Object.values(Events).reduce<EmitterListeners>(
			(acc, val: string) => ((acc[val] = new Set()), acc),
			{}
		),
		on<EventType extends keyof typeof Events>(
			events: EventType | EventType[],
			listener: ListenerFunction<EventType>
		): Function {
			const listen = (event: EventType) => {
				if (this.listeners[event].has(listener)) {
					throw Error(`This listener on ${event} already exists.`);
				}
				this.listeners[event].add(listener);
			};
			if (Array.isArray(events)) {
				for (const event of events) {
					listen(event);
				}
			} else {
				listen(events);
			}
			return () => this.off(events, listener);
		},
		once<EventType extends keyof typeof Events>(
			events: EventType | EventType[],
			listener: ListenerFunction<EventType>
		): Function {
			listener[offSymbol] = () => {
				this.off(events, listener);
			};
			return this.on(events, listener);
		},
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
		},

		emit<EventType extends keyof typeof Events>(
			event: keyof typeof Events,
			data: ListenerReceive<EventType>
		) {
			for (const listener of this.listeners[event].values()) {
				try {
					listener(data);
					listener[offSymbol]?.(data);
				} catch (e) {
					console.group(`[Nests] Error in listener:`);
					console.log(event, data);
					console.error(e);
					console.groupEnd();
				}
			}
		},
	} as EventEmitter;
}
