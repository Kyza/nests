import {
	Accessor,
	Component,
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

export const Primitive: Component = (props) => {
	return <></>;
};

export const TreeIndent: Component<{
	color?: string;
}> = (props) => {
	return (
		<div class={styles.indent} style={{ "border-color": props.color }}>
			{props.children}
		</div>
	);
};

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
		<div class={styles.treeBase}>
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

					let serializedData = value?.$$SERIALIZED_TYPE$$;

					return (
						<div class={styles.treeKey}>
							<Switch
								fallback={
									<>
										<span class={styles.key}>{key}</span>
										{": "}
										<span style={{ color: "hsl(252deg 100% 75%)" }}>
											{value.toString()}
										</span>
									</>
								}
							>
								{/* STRING */}
								<Match when={typeof value === "string"}>
									<span class={styles.key}>{key}</span>
									{": "}
									<span
										style={{ color: "rgb(242, 139, 84)" }}
									>{`"${value}"`}</span>
								</Match>

								{/* DATE */}
								<Match when={value instanceof Date}>
									<span class={styles.key}>{key}</span>
									{": "}
									<span style={{ color: "rgb(242, 139, 84)" }}>
										{value.toISOString()}
									</span>
								</Match>

								{/* ARRAY */}
								<Match when={Array.isArray(value)}>
									<span
										class={`${styles.expandable}`}
										onMouseDown={(e) => {
											if (e.button === 0) {
												setExpanded(!expanded());
											}
										}}
									>
										<span class={styles.key}>{key}</span>
										{": "}
										<span>
											<span class={styles.typeName}>
												{`(${value.length.toLocaleString()}) `}
											</span>
											{`[${!expanded() ? "...]" : ""}`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeIndent>
												<TreeLevel
													id={props.id}
													object={value}
													path={[...path(), key]}
												/>
											</TreeIndent>
											<span>{"]"}</span>
										</>
									) : null}
								</Match>

								{/* SERIALIZED PRIMITIVE */}
								<Match
									when={
										serializedData && typeof serializedData.value === "string"
									}
								>
									<span class={styles.key}>{key}</span>
									{": "}
									<span style={{ color: serializedData.color }}>
										{serializedData.value}
									</span>
								</Match>

								{/* SERIALIZED ARRAY-LIKE */}
								<Match
									when={serializedData && Array.isArray(serializedData.value)}
								>
									<span
										class={styles.expandable}
										onMouseDown={(e) => {
											if (e.button === 0) {
												setExpanded(!expanded());
											}
										}}
									>
										<span class={styles.key}>{key}</span>
										{": "}
										<span>
											<span style={{ color: serializedData.color }}>
												{`${serializedData.type} `}{" "}
											</span>
											{`[${!expanded() ? "...]" : ""}`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeIndent color={serializedData.color}>
												<TreeLevel
													id={props.id}
													object={serializedData.value}
													path={[...path(), key]}
												/>
											</TreeIndent>
											<span>{"]"}</span>
										</>
									) : null}
								</Match>

								{/* SERIALIZED OBJECT-LIKE */}
								<Match
									when={
										serializedData && typeof serializedData.value === "object"
									}
								>
									<span
										class={styles.expandable}
										onMouseDown={(e) => {
											if (e.button === 0) {
												setExpanded(!expanded());
											}
										}}
									>
										<span class={styles.key}>{key}</span>
										{": "}
										<span>
											<span style={{ color: serializedData.color }}>
												{`${serializedData.type} `}{" "}
											</span>
											{`{${!expanded() ? "...}" : ""}`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeIndent color={serializedData.color}>
												<TreeLevel
													id={props.id}
													object={serializedData.value}
													path={[...path(), key]}
												/>
											</TreeIndent>
											<span>{"}"}</span>
										</>
									) : null}
								</Match>

								{/* THIS SHOULD BE LAST */}
								{/* OBJECT */}
								<Match when={typeof value === "object"}>
									<span
										class={styles.expandable}
										onMouseDown={(e) => {
											if (e.button === 0) {
												setExpanded(!expanded());
											}
										}}
									>
										<span class={styles.key}>{key}</span>
										{": "}
										<span>
											<span class={styles.typeName}>
												{`(${Object.keys(value).length.toLocaleString()}) `}
											</span>
											{`{${!expanded() ? "...}" : ""}`}
										</span>
									</span>
									{expanded() ? (
										<>
											<TreeIndent>
												<TreeLevel
													id={props.id}
													object={value}
													path={[...path(), key]}
												/>
											</TreeIndent>
											<span>{"}"}</span>
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
