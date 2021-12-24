import EventEmitter from "./EventEmitter.js";

// Access points for the data.
export type NestAccessors<Data> = {
	state: Data;
	store: Data;
	ghost: Data;
};

export type BulkCallback<Data> = (nest: NestAccessors<Data>) => boolean | void;

export type BulkOption<Data> = {
	callback?: BulkCallback<Data>;
	transition?: boolean;
};

export type BulkOptions<Data> = {
	[key: string]: BulkOption<Data>;
};

export type BulkFunction<Data> = (
	callback: BulkCallback<Data>,
	transient?: boolean
) => void;

export default interface Nest<Data> extends NestAccessors<Data> {
	// A bulk updater for immutable state.
	bulk: BulkFunction<Data>;

	// Easy to access listeners.
	on: typeof EventEmitter.prototype.on;
	once: typeof EventEmitter.prototype.once;
	off: typeof EventEmitter.prototype.off;

	// Emitter.
	emitter: EventEmitter;
}
