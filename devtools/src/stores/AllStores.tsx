import { createStore } from "solid-js/store";

type Store = {
	history: any[];
};

type StoreCollection = {
	[id: string]: Store;
};

const [stores, setStores] = createStore<StoreCollection>({
	Count: {
		history: [
			{
				count: 0,
			},
			{
				count: 1,
			},
			{
				count: 2,
			},
		],
	},
	Todos: {
		history: [
			{
				count: 0,
			},
			{
				count: 1,
			},
			{
				count: 2,
			},
		],
	},
	水: {
		history: [
			{
				count: 0,
			},
			{
				count: 1,
			},
			{
				count: 2,
			},
		],
	},
});

export default { stores, setStores };
