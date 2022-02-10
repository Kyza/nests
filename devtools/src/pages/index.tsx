import { useNavigate } from "solid-app-router";
import { For } from "solid-js";

import AllStores from "../stores/AllStores";
import SelectedStore from "../stores/SelectedStore";

export default function SelectPanel() {
	const { stores } = AllStores;
	const [selectedStore, setSelectedStore] = SelectedStore;
	const navigate = useNavigate();

	return (
		<section class="p-4 pt-2">
			<h1 class="text-2xl font-bold">Select Store</h1>

			<div class="flex items-start">
				{Object.entries(stores).length === 0 ? (
					<p>No stores found. Connect one to see it here.</p>
				) : (
					<For each={Object.entries(stores)}>
						{([name, _data]) => (
							<input
								type="button"
								class={`duration-300 bg-[#cfd0d011] hover:(bg-[#cfd0d027]) rounded-xl p-2 cursor-pointer ${
									selectedStore() === name ? "!bg-[#cfd0d044]" : ""
								}`}
								onClick={() => {
									if (selectedStore() === name) {
										setSelectedStore(null);
									} else {
										setSelectedStore(name);
										navigate("/inspect");
									}
								}}
								value={name}
							/>
						)}
					</For>
				)}
			</div>
		</section>
	);
}
