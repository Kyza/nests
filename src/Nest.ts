import EventEmitter from "./EventEmitter";

export default interface Nest<Data> extends EventEmitter {
	store: Data;
	ghost: Data;
}
