// Import default from React or CRA fails.
// Why isn't CRA being updated to modern technologies if it's recommended officially.
import React from "react";
import { ListenerData } from "../EventEmitter";
import Nest from "../Nest";
import Events from "../Events";

export default function useNest(
	nest: Nest,
	transient: boolean = false,
	filter: (event: string, data: ListenerData) => boolean = () => true
): void {
	// Keep this here for React devtools.
	// @ts-ignore
	const value = React.useRef(nest.ghost);
	const [, forceUpdate] = React.useReducer((n) => ~n, 0);

	React.useEffect(() => {
		function listener(event: string, data: ListenerData) {
			if (filter(event, data)) forceUpdate();
		}
		nest.emitter.on(Events.UPDATE, listener);
		if (!transient) {
			nest.emitter.on(Events.SET, listener);
			nest.emitter.on(Events.DEL, listener);
		}

		return () => {
			nest.emitter.off(Events.UPDATE, listener);
			if (!transient) {
				nest.emitter.off(Events.SET, listener);
				nest.emitter.off(Events.DEL, listener);
			}
		};
	}, []);
}
