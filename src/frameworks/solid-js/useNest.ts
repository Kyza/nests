import { createSignal, onCleanup } from "solid-js";
import {
	ListenerData,
	BulkListenerData,
	ApplyListenerData,
	DeleteListenerData,
	SetListenerData,
} from "../../EventEmitter";
import Nest from "../../Nest";
import Events from "../../Events";
import set from "../../utils/set";

// A function that performs a deep get on an object.
function get(target: any, path: (string | symbol)[]) {
	let value = target;
	for (const key of path) {
		// @ts-ignore
		if (!Object.hasOwn(value, key)) return;
		value = value[key];
	}
	return value;
}

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
					// Iterate through the list of changes and update each unique signal.
					// If something has changed it only needs to be updated once.
					const events = new Set<string>();
					for (const bulkBit of data as BulkListenerData) {
						const hash = bulkBit.path.join(",");
						if (!events.has(hash)) {
							signals[hash]?.set(bulkBit.value);
							events.add(hash);
						}
					}
					return;
				case Events.UPDATE:
					// This is very slow. Symbols work but are even slower.
					return void signals[(data as ListenerData).path.join(",")]?.set(
						// Using a Symbol makes it always different, so we can have difference checking while still being able to force update on UPDATE.
						// Not sure how I feel about this. Maybe it could be better designed.
						Symbol()
					);
				default:
					// See duplicate in UPDATE case above.
					return void signals[(data as ListenerData).path.join(",")]?.set(
						// @ts-ignore This value could exist but I'm not expresssing that yet.
						data.value
					);
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
				const newPath = [...path, property];
				const hash = newPath.join(",");

				let signal = signals[hash];

				// If the signal doesn't exist, create it.
				if (signal == null) {
					const [getter, setter] = createSignal(target[property]);
					signals[hash] = signal = { get: getter, set: setter };
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
