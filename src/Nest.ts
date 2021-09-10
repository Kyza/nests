import EventEmitter from "./EventEmitter";

export default interface Nest extends EventEmitter {
	store: any;
	ghost: any;
}
