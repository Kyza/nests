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
				title: "Learn Solid",
				completed: true,
			},
			{
				title: "Learn Nests",
				completed: true,
			},
			{
				title: "Learn Nests Devtools",
				completed: false,
			},
		],
	},
});

export default { stores, setStores };
