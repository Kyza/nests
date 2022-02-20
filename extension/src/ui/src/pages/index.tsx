import { useNavigate } from "solid-app-router";
import { createMemo, For } from "solid-js";

import { stores, setStores } from "../stores/StoreData";
import { selectedStore, setSelectedStore } from "../stores/SelectedStore";

export default function SelectPanel() {
	const navigate = useNavigate();

	const storeNames = createMemo(() => Object.keys(stores()));

	return (
		<section class="p-4 pt-2">
			<h1 class="text-2xl font-bold">Select Store</h1>

			<div class="flex-row items-start gap-2 pt-2">
				{storeNames().length === 0 ? (
					<p>No stores found. Connect one to see it here.</p>
				) : (
					<For each={storeNames()}>
						{(name) => (
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
