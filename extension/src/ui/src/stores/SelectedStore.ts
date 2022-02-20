import { createSignal } from "solid-js";

const [selectedStore, setSelectedStore] = createSignal<string | undefined>(
	null
);

export { selectedStore, setSelectedStore };
