import { useRef, useReducer, useEffect } from "react";
import {
	ApplyListenerData,
	DeleteListenerData,
	SetListenerData,
	BulkListenerData,
} from "../../EventEmitter";
import Nest from "../../Nest";
import Events from "../../Events";
import on from "../../on";

export default function useNest<Data>(
	nest: Nest<Data>,
	transient: boolean = false,
	filter: (
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
			data:
				| BulkListenerData
				| SetListenerData
				| DeleteListenerData
				| ApplyListenerData
		) {
			if (filter(data)) forceUpdate();
		}
		on(Events.UPDATE, nest, listener);
		if (!transient) {
			on(
				[Events.BULK, Events.SET, Events.DELETE, Events.APPLY],
				nest,
				listener
			);
		}

		return () => {
			nest.off(Events.UPDATE, listener);
			if (!transient) {
				nest.off(
					[Events.BULK, Events.SET, Events.DELETE, Events.APPLY],
					listener
				);
			}
		};
	}, []);

	return nest.state;
}
