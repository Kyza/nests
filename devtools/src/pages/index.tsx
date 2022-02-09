import { useNavigate } from "solid-app-router";
import { createSignal, For } from "solid-js";

import AllStores from "../stores/AllStores";
import SelectedStore from "../stores/SelectedStore";

export default function Dashboard() {
	const { stores, setStores } = AllStores;
	const [selectedStore, setSelectedStore] = SelectedStore;
	const navigate = useNavigate();

	return (
		<section class="p-4 pt-2">
			<h1 class="text-2xl font-bold">Inspect Store</h1>

			<div class="flex items-center space-x-2 pt-2">
				<For each={Object.entries(stores)}>
					{([name, _data]) => (
						<input
							type="button"
							class={`duration-300 bg-[#cfd0d011] hover:(bg-[#cfd0d027]) rounded-xl p-2 cursor-pointer ${
								selectedStore() === name
									? "!cursor-not-allowed !bg-[#cfd0d044]"
									: ""
							}`}
							disabled={selectedStore() === name}
							onClick={() => {
								if (selectedStore() === name) {
									setSelectedStore(null);
								} else {
									setSelectedStore(name);
								}
								navigate("/state");
							}}
							value={name}
						/>
					)}
				</For>
			</div>
		</section>
	);
}
