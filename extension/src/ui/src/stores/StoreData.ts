import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export type HistoryPoint = {
	time: Date;
	name: string;
	data: any;
};

export type TrackedStore = {
	history: HistoryPoint[];
};

type StoreCollection = {
	[id: string]: TrackedStore;
};

const [stores, setStores] = createSignal<StoreCollection>(
	{},
	{
		equals: false,
	}
);

export { stores, setStores };
