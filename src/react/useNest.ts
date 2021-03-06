// Import default from React or CRA fails.
// Why isn't CRA being updated to modern technologies if it's recommended officially.
import { useRef, useReducer, useEffect } from "react";
import { ListenerData } from "../EventEmitter";
import Nest from "../Nest";
import Events from "../Events";

export default function useNest<Data>(
	nest: Nest<Data>,
	transient: boolean = false,
	filter: (event: string, data: ListenerData) => boolean = () => true
): Data {
	// Keep this here for React devtools.
	// @ts-ignore
	const value = useRef(nest.ghost);
	const [, forceUpdate] = useReducer((n) => ~n, 0);

	useEffect(() => {
		function listener(event: string, data: ListenerData) {
			if (filter(event, data)) forceUpdate();
		}
		nest.on(Events.UPDATE, listener);
		if (!transient) {
			nest.on(Events.SET, listener);
			nest.on(Events.DELETE, listener);
		}

		return () => {
			nest.off(Events.UPDATE, listener);
			if (!transient) {
				nest.off(Events.SET, listener);
				nest.off(Events.DELETE, listener);
			}
		};
	}, []);

	return nest.ghost;
}
