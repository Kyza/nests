import { useRef, useReducer, useEffect } from "react";
import {
	ApplyListenerData,
	DeleteListenerData,
	SetListenerData,
	BulkListenerData,
} from "../../utils/EventEmitter";
import Nest from "../../Nest";
import Events from "../../Events";
import { on } from "../../listeners";

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
		const unsubUpdate = on(Events.UPDATE, nest, listener);
		let unsubRest;
		if (!transient) {
			unsubRest = on(
				[Events.BULK, Events.SET, Events.DELETE, Events.APPLY],
				nest,
				listener
			);
		}

		return () => {
			unsubUpdate();
			unsubRest?.();
		};
	}, []);

	return nest.state;
}
