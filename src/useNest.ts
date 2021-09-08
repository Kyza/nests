import { useState, useEffect, useRef } from "react";
import EventEmitter, { ListenerData } from "./EventEmitter";
import NestEvents from "./NestEvents";

export default function useNest({
	nest,
	emitter,
	filter = () => true,
}: {
	nest?: typeof Proxy;
	emitter: EventEmitter;
	filter?: (data: ListenerData) => boolean;
}): void {
	const value = useRef(nest);
	const [updater, setUpdater] = useState(false);

	useEffect(() => {
		function listener(data: ListenerData) {
			if (filter(data)) setUpdater(!updater);
		}
		emitter.on(NestEvents.SET, listener);
		emitter.on(NestEvents.DEL, listener);

		return () => {
			emitter.off(NestEvents.SET, listener);
			emitter.off(NestEvents.DEL, listener);
		};
	}, [updater]);
}
