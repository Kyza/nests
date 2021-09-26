import { createSignal, onCleanup } from "solid-js";
import { ListenerData } from "../EventEmitter";
import Nest from "../Nest";
import Events from "../Events";

export default function useNest(
	nest: Nest,
	transient: boolean = false,
	filter: (event: string, data: ListenerData) => boolean = () => true
): () => any {
	const signals = {};

	function listener(event: string, data: ListenerData) {
		if (filter(event, data)) {
			// Update the proper signal.
			signals[data.path.join(",")].set(void 0);
		}
	}
	nest.on(Events.UPDATE, listener);
	if (!transient) {
		nest.on(Events.SET, listener);
		nest.on(Events.DELETE, listener);
	}

	onCleanup(() => {
		nest.off(Events.UPDATE, listener);
		if (!transient) {
			nest.off(Events.SET, listener);
			nest.off(Events.DELETE, listener);
		}
	});

	function createProxy(target: any, root: any, path: string[]) {
		return new Proxy(target, {
			get(target, property: string) {
				const newPath: string[] = [...path, property];
				const newPathString = newPath.join(",");

				// If the signal doesn't exist, create it.
				if (!signals.hasOwnProperty(newPathString)) {
					// Maybe try to get rid of { equals: false } eventually.
					// The problem is UPDATE which is controlled by the user doesn't pass a data.value.
					const [get, set] = createSignal(target[property], { equals: false });
					signals[newPathString] = { get, set };
				}

				// Call get on the signal.
				signals[newPathString].get();

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

	// Wrap the ghost in a deep proxy to automatically call get on the signals for automatic updates that are compatible and smooth with Solid.
	return createProxy(nest.ghost, nest.ghost, []);
}
