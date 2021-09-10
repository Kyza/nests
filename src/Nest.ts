import EventEmitter from "./EventEmitter";

export default interface Nest {
	store: any;
	ghost: any;
	emitter: EventEmitter;
}
