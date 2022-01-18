import { useRef, useReducer, useEffect } from "react";
import {
	ApplyListenerData,
	DeleteListenerData,
	SetListenerData,
	BulkListenerData,
} from "../../lib-utils/makeEmitter";
import Events from "../../Events";
import { on } from "../../utils";

export default function useNest<Data>(
	nest: Data,
	transient: boolean = false,
	filter: (
		data:
			| BulkListenerData
			| SetListenerData
			| DeleteListenerData
			| ApplyListenerData
	) => boolean = () => true
): Data {
	// @ts-ignore Keep this here for React DevTools. It's not used and TS doesn't like that, but I don't want to turn off the option.
	const value = useRef(nest);
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

	return nest;
}
