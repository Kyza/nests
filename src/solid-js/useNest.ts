import { createSignal, onCleanup } from "solid-js";
import {
	ListenerData,
	BulkListenerData,
	ApplyListenerData,
	DeleteListenerData,
	SetListenerData,
} from "../EventEmitter";
import Nest from "../Nest";
import Events from "../Events";
import set from "../utils/set";
import get from "../utils/get";

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
	const signals = {};

	function listener(
		event: string,
		data:
			| BulkListenerData
			| SetListenerData
			| DeleteListenerData
			| ApplyListenerData
	) {
		if (filter(event, data)) {
			// Update the proper signal.
			switch (event) {
				case Events.BULK:
					for (const bulkBit of data as BulkListenerData) {
						get(signals, bulkBit.path).set(void 0);
					}
					return;
				default:
					return void get(signals, (data as ListenerData).path).set(void 0);
			}
		}
	}
	nest.on(Events.UPDATE, listener);
	if (!transient) {
		nest.on(Events.BULK, listener);
		nest.on(Events.SET, listener);
		nest.on(Events.DELETE, listener);
		nest.on(Events.APPLY, listener);
	}

	onCleanup(() => {
		nest.off(Events.UPDATE, listener);
		if (!transient) {
			nest.off(Events.BULK, listener);
			nest.off(Events.SET, listener);
			nest.off(Events.DELETE, listener);
			nest.off(Events.APPLY, listener);
		}
	});

	function createProxy(target: any, root: any, path: (string | symbol)[]) {
		return new Proxy(target, {
			get(target, property: string | symbol) {
				const newPath: (string | symbol)[] = [...path, property];

				let signal = get(signals, newPath);

				// If the signal doesn't exist, create it.
				if (!signal) {
					// Maybe try to get rid of { equals: false } eventually.
					// The problem is UPDATE which is controlled by the user doesn't pass a data.value.
					const [getter, setter] = createSignal(target[property], {
						equals: false,
					});
					set(signals, newPath, (signal = { get: getter, set: setter }));
				}

				// Call get on the signal.
				signal.get();

				// If it's not an ending, deep proxy it more.
				// Otherwise return the value.
				const value = target[property];
				if (typeof value === "object") {
					return createProxy(value, root, newPath);
				}

				return value;
			},
		});
	}

	// Wrap the state in a deep proxy to automatically call get on the signals for automatic updates that are compatible and smooth with Solid.
	return createProxy(nest.state, nest.state, []);
}
