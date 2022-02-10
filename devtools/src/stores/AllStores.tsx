import { createStore } from "solid-js/store";
import TabID from "./TabID";
const [tabID, setTabID] = TabID;

type Store = {
	history: any[];
};

type StoreCollection = {
	[id: string]: Store;
};

const [stores, setStores] = createStore<StoreCollection>({});

export default { stores, setStores };
