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
			if (typeof filter !== "function")
				setState({ nest: state.nest, updater: !state.updater });
			if (filter(data)) setState({ nest: state.nest, updater: !state.updater });
		}
		emitter.on(NestEvents.AFTER_SET, listener);
		emitter.on(NestEvents.AFTER_DEL, listener);

		return () => {
			emitter.off(NestEvents.AFTER_SET, listener);
			emitter.off(NestEvents.AFTER_DEL, listener);
		};
	});
}
