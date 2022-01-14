import { createSignal, onCleanup } from "solid-js";
import {
	ListenerData,
	BulkListenerData,
	ApplyListenerData,
	DeleteListenerData,
	SetListenerData,
} from "../../utils/EventEmitter";
import Events from "../../Events";
import { on } from "../../listeners";
import {
	deepSymbol,
	loudSymbol,
	shallowSymbol,
	silentSymbol,
} from "../../symbols";
import symbolJoin from "../../utils/symbolJoin";

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
	const signals = {};

	function listener(
		data:
			| BulkListenerData
			| SetListenerData
			| DeleteListenerData
			| ApplyListenerData
	) {
		if (filter(data)) {
			// Update the proper signal.
			// @ts-ignore
			switch (data.event) {
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
					return void signals[
						symbolJoin((data as ListenerData).path, ".")
					]?.set(
						// Using a Symbol makes it always different, so we can have difference checking while still being able to force update on UPDATE.
						// Not sure how I feel about this. Maybe it could be better designed.
						Symbol()
					);
				default:
					// See duplicate in UPDATE case above.
					return void signals[
						symbolJoin((data as ListenerData).path, ".")
					]?.set(
						// @ts-ignore This value could exist but I'm not expresssing that yet.
						data.value
					);
			}
		}
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

	onCleanup(() => {
		unsubUpdate();
		unsubRest?.();
	});

	function createProxy(target: any, root: any, path: (string | symbol)[]) {
		return new Proxy(target, {
			get(target, key: string | symbol) {
				// Temporary fix for weirdness.
				// Uncaught (in promise) TypeError: '#<Object>' returned for property 'Symbol(Symbol.toPrimitive)' of object '#<Object>' is not a function
				if (typeof key === "symbol") {
					switch (key) {
						case Symbol.toPrimitive:
							return;
						case shallowSymbol:
						case deepSymbol:
						case silentSymbol:
						case loudSymbol:
							// If the object is transformed it needs to be rewrapped.
							return createProxy(target[shallowSymbol], root, path);
					}
				}

				const newPath = [...path, key];
				const hash = symbolJoin(newPath, ".");

				let signal = signals[hash];

				// If the signal doesn't exist, create it.
				if (signal == null) {
					// Make sure to test if the property exists or not since Solid will fail to create the signal if given an empty Proxy.
					const [getter, setter] = createSignal(
						!(key in target) ? "undefined" : target[key]
					);
					signals[hash] = signal = { get: getter, set: setter };
				}

				// Call get on the signal.
				signal.get();

				// If it's not an ending, deep proxy it more.
				// Otherwise return the value.
				const value = target[key];
				if (typeof value === "object") {
					return createProxy(value, root, newPath);
				}

				return value;
			},
		});
	}

	// Wrap the state in a deep proxy to automatically call get on the signals for automatic updates that are compatible and smooth with Solid.
	return createProxy(nest, nest, []);
}
