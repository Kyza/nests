import { Link } from "solid-app-router";
import {
	createMemo,
	createSelector,
	createSignal,
	For,
	Index,
	Match,
	Switch,
} from "solid-js";

import { stores } from "../stores/StoreData";
import { selectedStore } from "../stores/SelectedStore";
import {
	selectedTreeView,
	setSelectedTreeView,
} from "../stores/SelectedTreeView";

import styles from "./inspect.module.css";
import ResizeBox from "../components/ResizeBox";
import Tree from "../components/Tree";
import NavBar, { NavBarLink } from "../components/NavBar";

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
						<NavBar>
							<NavBarLink
								onClick={() => {
									setSelectedTreeView("tree");
								}}
								selected={selectedTreeView() === "tree"}
							>
								Tree
							</NavBarLink>
							<NavBarLink
								onClick={() => {
									setSelectedTreeView("diff");
								}}
								selected={selectedTreeView() === "diff"}
							>
								Diff
							</NavBarLink>
						</NavBar>
						<div class={styles.inspectPointContent}>
							<Switch>
								<Match when={selectedTreeView() === "tree"}>
									<Tree
										id={selectedStore()}
										object={selectedHistoryPointData()}
									/>
								</Match>
								<Match when={selectedTreeView() === "diff"}>lol</Match>
							</Switch>
						</div>
					</div>
				</ResizeBox>
			)}
		</>
	);
}
