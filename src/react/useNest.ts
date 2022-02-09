import { useRef, useReducer, useEffect } from "react";
import {
	DeleteListenerData,
	SetListenerData,
	BulkListenerData,
} from "../lib-utils/makeEmitter";
import Events from "../Events";
import { on } from "../utils";
import Nest from "../Nest";

export default function useNest<Data extends object>(
	nest: Nest<Data>
): Nest<Data> {
	// @ts-ignore Keep this here for React DevTools. It's not used and TS doesn't like that, but I don't want to turn off the option.
	const value = useRef(nest);
	const [, forceUpdate] = useReducer((n) => !n, !1);

	useEffect(() => {
		const unsub = on(
			Object.values(Events),
			nest,
			function listener(
				_data: BulkListenerData | SetListenerData | DeleteListenerData
			) {
				// TODO: Check for diff.
				forceUpdate();
			}
		);

		return () => {
			unsub();
		};
	}, []);

	return nest;
}
