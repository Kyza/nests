import { Link, useNavigate } from "solid-app-router";
import { createEffect, createMemo, createSignal, For, Index } from "solid-js";

import { stores, setStores } from "../stores/StoreData";
import { selectedStore, setSelectedStore } from "../stores/SelectedStore";
import ToggleButton from "../components/ToggleButton";

import styles from "./inspect.module.css";
import ResizeBox from "../components/ResizeBox";
import Tree from "../components/Tree";
import { createStore } from "solid-js/store";

export default function InspectPage() {
	const [selectedHistoryPoint, setSelectedHistoryPoint] = createSignal(null);

	const selectedStoreData = () => stores()[selectedStore()];
	const selectedStoreHistory = () => selectedStoreData()?.history;

	const selectedHistoryPointData = createMemo(() =>
		selectedHistoryPoint() != null
			? selectedStoreHistory()[selectedHistoryPoint()]
			: selectedStoreHistory()[selectedStoreData().history.length - 1]
	);

	return (
		<>
			{/* <h1 class="text-2xl font-bold">Inspect {selectedStore() ?? "Store"}</h1> */}
			{selectedStoreData() == null ? (
				<p>
					<Link href="/">Select a store</Link> to inspect it.
				</p>
			) : (
				<ResizeBox
					class={styles.inspectPanel}
					direction="horizontal"
					left={100}
					right={100}
				>
					<div class={styles.inspectHistory}>
						<Index each={selectedStoreHistory()}>
							{(point, i) => (
								<ToggleButton
									selected={selectedHistoryPoint() === i}
									onClick={() => {
										if (selectedHistoryPoint() === i) {
											setSelectedHistoryPoint(null);
										} else {
											setSelectedHistoryPoint(i);
										}
									}}
								>
									{point().name}
								</ToggleButton>
							)}
						</Index>
					</div>
					<div class={styles.inspectPoint}>
						<Tree object={selectedHistoryPointData()} />
					</div>
				</ResizeBox>
			)}
		</>
	);
}
