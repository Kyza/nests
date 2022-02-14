import {
	Accessor,
	createEffect,
	createMemo,
	createSignal,
	For,
	Index,
	Match,
	Switch,
	untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import get from "../utils/get";
import set from "../utils/set";
import walkTree from "../utils/walkTree";

import styles from "./Tree.module.css";

const level = Symbol("levelData");

export function TreeLevel(props: { object: object; levelData: TreeLevelData }) {
	const nodes = createMemo(() => Object.entries(props.object), {
		equals: false,
	});

	return (
		<div class={styles.treeBase}>
			<For each={nodes()}>
				{([key, value]) => {
					if (props.levelData[key] == null) return null;
					const { expanded, setExpanded } = props.levelData[key][level];
					return (
						<Switch>
							<Match when={typeof value === "string"}>
								<div>{`${key}: "${value}"`}</div>
							</Match>
							<Match
								when={typeof value === "boolean" || typeof value === "number"}
							>
								<div>{`${key}: ${value}`}</div>
							</Match>
							<Match when={value instanceof Date || value instanceof RegExp}>
								<div>{`${key}: ${value.toString()}`}</div>
							</Match>
							<Match when={Array.isArray(value)}>
								<div
									class={`${styles.treeKey} ${styles.treeKeyExpandable}`}
									onMouseDown={() => {
										console.log(!expanded());
										setExpanded(!expanded());
									}}
								>{`${key}: [${
									!expanded() ? `...] ${value.length.toLocaleString()}` : ""
								}`}</div>
								{expanded() ? (
									<>
										<TreeLevel
											object={value}
											levelData={props.levelData[key]}
										/>
										{"]"}
									</>
								) : null}
							</Match>
							<Match when={typeof value === "object"}>
								<div
									class={`${styles.treeKey} ${styles.treeKeyExpandable}`}
									onMouseDown={() => {
										console.log(!expanded());
										setExpanded(!expanded());
									}}
								>{`${key}: {${
									!expanded() ? `...} ${Object.keys(value).length}` : ""
								}`}</div>
								{expanded() ? (
									<>
										<TreeLevel
											object={value}
											levelData={props.levelData[key]}
										/>{" "}
										{"}"}
									</>
								) : null}
							</Match>
						</Switch>
					);
				}}
			</For>
		</div>
	);
}

type TreeLevelData = {
	[key: PropertyKey]: TreeLevelData;
} & {
	[level]?: {
		expanded: Accessor<boolean>;
		setExpanded: (expanded: boolean) => void;
	};
};

const [levelData, setLevelData] = createSignal<TreeLevelData>({});

export default function TreeRoot(props: { object: object }) {
	function calculateTreeLevelData() {
		const newLD = untrack(levelData);

		walkTree(props.object, (node, path) => {
			const currentLevel = get(newLD, path);
			if (currentLevel?.[level] == null) {
				const [expanded, setExpanded] = createSignal(true);
				set(newLD, [...path, level], {
					expanded,
					setExpanded,
				});
			}
		});

		setLevelData(newLD);
	}

	calculateTreeLevelData();
	createEffect(() => {
		calculateTreeLevelData();
	});

	return <TreeLevel object={props.object} levelData={levelData()} />;
}
