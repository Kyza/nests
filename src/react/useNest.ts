import { useState, useEffect, useRef } from "react";
import { ListenerData } from "../EventEmitter";
import { Nest } from "../Nest";
import NestEvents from "../NestEvents";

export default function useNest(
	nestExport: Nest,
	filter: (data: ListenerData) => boolean = () => true
): void {
	const { nest, emitter } = nestExport;
	// Keep this here for React devtools.
	// @ts-ignore
	const [value] = useRef(nest);
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
