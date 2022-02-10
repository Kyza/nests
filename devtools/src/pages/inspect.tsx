import { Link, useNavigate } from "solid-app-router";
import { For } from "solid-js";

import AllStores from "../stores/AllStores";
import SelectedStore from "../stores/SelectedStore";

export default function InspectPanel() {
	const { stores } = AllStores;
	const [selectedStore, setSelectedStore] = SelectedStore;
	const navigate = useNavigate();

	const selectedStoreData = () => stores[selectedStore()];

	return (
		<section class="p-4 pt-2">
			<h1 class="text-2xl font-bold">Inspect {selectedStore() ?? "Store"}</h1>
			{selectedStoreData() == null ? (
				<p>
					<Link href="/">Select a store</Link> to inspect it.
				</p>
			) : (
				<div class="flex flex-col items-start">
					<For each={selectedStoreData().history}>
						{(data) => <div>{JSON.stringify(data, null, "\t")}</div>}
					</For>
				</div>
			)}
		</section>
	);
}
