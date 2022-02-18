import { Link } from "solid-app-router";
import { createMemo, createSignal, For, Index } from "solid-js";

import { stores } from "../stores/StoreData";
import { selectedStore } from "../stores/SelectedStore";

import styles from "./inspect.module.css";
import ResizeBox from "../components/ResizeBox";
import Tree from "../components/Tree";

export default function InspectPage() {
	const [selectedHistoryPoint, setSelectedHistoryPoint] = createSignal(null);

	const selectedStoreData = () => stores()[selectedStore()];
	const selectedStoreHistory = () => selectedStoreData()?.history;

	const selectedHistoryPointData = () =>
		(selectedHistoryPoint() != null
			? selectedStoreHistory()[selectedHistoryPoint()]
			: selectedStoreHistory()[selectedStoreData().history.length - 1]
		).data;

	return (
		<>
			{selectedStore() == null ? (
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
						<For each={selectedStoreHistory()}>
							{(node, i) => (
								<input
									type="button"
									classList={{
										[styles.inspectHistoryButton]: true,
										[styles.selected]: selectedHistoryPoint() === i(),
									}}
									onMouseDown={(e) => {
										if (e.button === 0) {
											if (selectedHistoryPoint() === i()) {
												setSelectedHistoryPoint(null);
											} else {
												setSelectedHistoryPoint(i());
											}
										}
									}}
									value={node.name}
								/>
							)}
						</For>
					</div>
					<div class={styles.inspectPoint}>
						<Tree id={selectedStore()} object={selectedHistoryPointData()} />
					</div>
				</ResizeBox>
			)}
		</>
	);
}
