import { createStore, reconcile } from "solid-js/store";
import type { Store } from "solid-js/store";
import { BulkListenerData, SetListenerData } from "../lib-utils/makeEmitter";
import Events from "../Events";
import { copy, on } from "../utils";
import { onCleanup } from "solid-js";
import Nest from "../Nest";

export default function useNest<Data extends object>(
	nest: Nest<Data>
): Store<Data> {
	const [store, setStore] = createStore<Data>(copy(nest));

	const unsub = on(Object.values(Events), nest, function listener(data) {
		switch (data.event) {
			case Events.BULK:
				for (const item of (data as BulkListenerData).value) {
					listener(item as any);
				}
				break;
			case Events.DELETE:
				setStore(...(data.path as [any]), undefined);
				break;
			case Events.SET:
				setStore(
					...(data.path as [any]),
					reconcile((data as SetListenerData).value)
				);
				break;
		}
	});
	onCleanup(() => {
		unsub();
	});

	return store;
}
