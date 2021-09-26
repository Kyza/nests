import { createSignal, onCleanup } from "solid-js";
import { ListenerData } from "../EventEmitter";
import Nest from "../Nest";
import Events from "../Events";

export default function useNest(
	nest: Nest,
	transient: boolean = false,
	filter: (event: string, data: ListenerData) => boolean = () => true
): () => any {
	// You can't use JSON.stringify on a nest.store since the proxies return {} instead of undefined for a non-existent value.
	const [signalGhost, setGhost] = createSignal(nest.ghost, { equals: false });

	function listener(event: string, data: ListenerData) {
		if (filter(event, data)) setGhost(nest.ghost);
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

	return signalGhost;
}
