import { useState, useEffect } from "react";
import EventEmitter, { ListenerData } from "./EventEmitter";
import NestEvents from "./NestEvents";

export default function useNest({
	nest,
	emitter,
	filter = () => true,
}: {
	nest: typeof Proxy;
	emitter: EventEmitter;
	filter?: (data: ListenerData) => boolean;
}): any {
	const [state, setState] = useState({ nest, updater: false });

	useEffect(() => {
		function listener(data: ListenerData) {
			const newState = { nest: state.nest, updater: !state.updater };
			if (typeof filter !== "function") setState(newState);
			if (filter(data)) setState(newState);
		}
		emitter.on(NestEvents.AFTER_SET, listener);
		emitter.on(NestEvents.AFTER_DEL, listener);

		return () => {
			emitter.off(NestEvents.AFTER_SET, listener);
			emitter.off(NestEvents.AFTER_DEL, listener);
		};
	});
}
