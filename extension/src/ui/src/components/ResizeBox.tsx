import createResizeObserver from "@solid-primitives/resize-observer";
import {
	createEffect,
	createMemo,
	createSignal,
	For,
	onCleanup,
	onMount,
} from "solid-js";

import styles from "./ResizeBox.module.css";

export default function ResizeBox(props) {
	let resizeBox: HTMLDivElement;
	let resizeBar: HTMLDivElement;

	const direction: () => string = () => props.direction;
	const vertical = () => direction() === "vertical";
	const [isDragging, setIsDragging] = createSignal<boolean>(false);
	const [boxSize, setBoxSize] = createSignal<number>(0);

	onMount(() => {
		setBoxSize(
			(vertical() ? resizeBox.clientHeight : resizeBox.clientWidth) / 2
		);
		createResizeObserver({
			refs: [resizeBox],
			onResize: (size) => {
				setBoxSize(
					Math.min(boxSize(), (vertical() ? size.height : size.width) - 8)
				);
			},
		});
	});

	const stopDragging = () => {
		setIsDragging(false);
	};
	const drag = (e) => {
		if (!isDragging()) return;

		// TODO: Handle 3 or more elements properly.
		const offset = vertical() ? resizeBox.offsetTop : resizeBox.offsetLeft;
		const newSize =
			(vertical() ? e.clientY : e.clientX) -
			offset -
			(vertical() ? resizeBar.clientHeight : resizeBar.clientWidth);

		setBoxSize(newSize);
	};

	document.body.addEventListener("mouseup", stopDragging);
	document.body.addEventListener("mousemove", drag);
	onCleanup(() => {
		document.body.removeEventListener("mouseup", stopDragging);
		document.body.removeEventListener("mousemove", drag);
	});

	return (
		<div
			ref={resizeBox}
			class={[
				props.class,
				styles.resizeBox,
				vertical() ? styles.resizeBoxVertical : styles.resizeBoxHorizontal,
			].join(" ")}
			style={{
				"min-width": props.left + props.right + 6 + "px",
				"grid-template-columns": `${boxSize()}px 6px auto`,
				"grid-template-rows": `100%`,
			}}
		>
			<div class={styles.resizeBoxChild}>{props.children[0]}</div>
			<div
				ref={resizeBar}
				class={styles.resizeBar}
				style={{
					cursor: vertical() ? "row-resize" : "col-resize",
				}}
				onMouseDown={() => {
					setIsDragging(true);
				}}
			/>
			<div class={styles.resizeBoxChild}>{props.children[1]}</div>
		</div>
	);
}
