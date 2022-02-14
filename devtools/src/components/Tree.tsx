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
import symbolJoin from "../utils/symbolJoin";
import walkTree from "../utils/walkTree";

import styles from "./Tree.module.css";

type TreeLevelData = {
	[id: string]: {
		[key: string]: {
			expanded: Accessor<boolean>;
			setExpanded: (expanded: boolean) => void;
		};
	};
};

const [levelData, setLevelData] = createStore<TreeLevelData>({});

export default function TreeLevel(props: {
	id: string;
	object: object;
	path?: PropertyKey[];
}) {
	const path = createMemo(() => props.path ?? []);
	const nodes = createMemo(() => Object.entries(props.object));

	if (levelData[props.id] == null) {
		setLevelData(props.id, {});
	}

	return (
		<div
			class={`${styles.treeBase} ${path().length > 0 ? styles.indent : ""} ${
				path().length > 0 ? styles.indentLine : ""
			}`}
		>
			<For each={nodes()}>
				{([key, value]) => {
					const stringPath = symbolJoin([...path(), key], ".");

					let expanded, setExpanded;
					if (Array.isArray(value) || typeof value === "object") {
						if (levelData[props.id][stringPath] == null) {
							const [e, sE] = createSignal(false);
							expanded = e;
							setExpanded = sE;
							setLevelData(props.id, stringPath, {
								expanded: e,
								setExpanded: sE,
							});
						} else {
							expanded = levelData[props.id][stringPath].expanded;
							setExpanded = levelData[props.id][stringPath].setExpanded;
						}
					}

					return (
						<div class={styles.treeKey}>
							<Switch>
								<Match when={typeof value === "string"}>
									<span class={styles.pill}>{`${key}`}</span>
									{":"}
									<span class={styles.pill}>{`"${value}"`}</span>
								</Match>
								<Match
									when={
										typeof value === "boolean" ||
										typeof value === "number" ||
										value instanceof RegExp
									}
								>
									<span class={styles.pill}>{`${key}`}</span>
									{":"}
									<span class={styles.pill}>{`${value}`}</span>
								</Match>
								<Match when={value instanceof Date}>
									<span class={styles.pill}>{`${key}`}</span>
									{":"}
									<span class={styles.pill}>{`${value.toISOString()}`}</span>
								</Match>
								<Match when={Array.isArray(value)}>
									<span
										class={`${styles.expandable}`}
										onMouseDown={() => {
											setExpanded(!expanded());
										}}
									>
										<span class={styles.pill}>{`${key}`}</span>
										{":"}
										<span class={styles.pill}>
											{!expanded()
												? `${value.length.toLocaleString()} [...]`
												: `${value.length.toLocaleString()} [`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeLevel
												id={props.id}
												object={value}
												path={[...path(), key]}
											/>
											<span class={styles.pill}>{"]"}</span>
										</>
									) : null}
								</Match>
								<Match when={value instanceof Map}>
									<span
										class={styles.expandable}
										onMouseDown={() => {
											setExpanded(!expanded());
										}}
									>
										<span class={styles.pill}>{`${key}`}</span>
										{":"}
										<span class={styles.pill}>
											{!expanded()
												? `${value.size.toLocaleString()} Map{...}`
												: `${value.size.toLocaleString()} Map{`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeLevel
												id={props.id}
												object={Object.fromEntries(value.entries())}
												path={[...path(), key]}
											/>
											<span class={styles.pill}>{"}"}</span>
										</>
									) : null}
								</Match>
								<Match when={value instanceof Set}>
									<span
										class={styles.expandable}
										onMouseDown={() => {
											setExpanded(!expanded());
										}}
									>
										<span class={styles.pill}>{`${key}`}</span>
										{":"}
										<span class={styles.pill}>
											{!expanded()
												? `${value.size.toLocaleString()} Set[...]`
												: `${value.size.toLocaleString()} Set[`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeLevel
												id={props.id}
												object={[...value]}
												path={[...path(), key]}
											/>
											<span class={styles.pill}>{"]"}</span>
										</>
									) : null}
								</Match>
								<Match when={typeof value === "object"}>
									<span
										class={styles.expandable}
										onMouseDown={() => {
											setExpanded(!expanded());
										}}
									>
										<span class={styles.pill}>{`${key}`}</span>
										{":"}
										<span class={styles.pill}>
											{!expanded()
												? `${Object.keys(value).length.toLocaleString()} {...}`
												: `${Object.keys(value).length.toLocaleString()} {`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeLevel
												id={props.id}
												object={value}
												path={[...path(), key]}
											/>
											<span class={styles.pill}>{"}"}</span>
										</>
									) : null}
								</Match>
							</Switch>
						</div>
					);
				}}
			</For>
		</div>
	);
}
