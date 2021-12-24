import { useRef, useReducer, useEffect } from "react";
import {
	ApplyListenerData,
	DeleteListenerData,
	SetListenerData,
	BulkListenerData,
} from "../../EventEmitter";
import Nest from "../../Nest";
import Events from "../../Events";

export default function useNest<Data>(
	nest: Nest<Data>,
	transient: boolean = false,
	filter: (
		event: string,
		data:
			| BulkListenerData
			| SetListenerData
			| DeleteListenerData
			| ApplyListenerData
	) => boolean = () => true
): Data {
	// @ts-ignore Keep this here for React DevTools. It's not used and TS doesn't like that.
	const value = useRef(nest.state);
	const [, forceUpdate] = useReducer((n) => !n, !1);

	useEffect(() => {
		function listener(
			event: string,
			data:
				| BulkListenerData
				| SetListenerData
				| DeleteListenerData
				| ApplyListenerData
		) {
			if (filter(event, data)) forceUpdate();
		}
		nest.on(Events.UPDATE, listener);
		if (!transient) {
			nest.on(Events.BULK, listener);
			nest.on(Events.SET, listener);
			nest.on(Events.DELETE, listener);
			nest.on(Events.APPLY, listener);
		}

		return () => {
			nest.off(Events.UPDATE, listener);
			if (!transient) {
				nest.off(Events.BULK, listener);
				nest.off(Events.SET, listener);
				nest.off(Events.DELETE, listener);
				nest.off(Events.APPLY, listener);
			}
		};
	}, []);

	return nest.state;
}
