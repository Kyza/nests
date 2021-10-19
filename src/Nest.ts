import EventEmitter from "./EventEmitter";

// Access points for the data.
export type NestAccessors<Data> = {
	store: Data;
	state: Data;
	ghost: Data;
};

export default interface Nest<Data> extends NestAccessors<Data> {
	// A bulk updater for immutable state.
	bulk: (
		callback: (nest: NestAccessors<Data>) => void,
		transient?: boolean
	) => void;

	// Easy to access listeners.
	on: typeof EventEmitter.prototype.on;
	once: typeof EventEmitter.prototype.once;
	off: typeof EventEmitter.prototype.off;

	// Emitter.
	emitter: EventEmitter;
}
