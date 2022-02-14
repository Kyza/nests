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

	const [resizeBoxWidth, setResizeBoxWidth] = createSignal<number>(0);
	const [resizeBoxHeight, setResizeBoxHeight] = createSignal<number>(0);

	onMount(() => {
		setBoxSize(
			(vertical() ? resizeBox.clientHeight : resizeBox.clientWidth) / 2
		);
		createResizeObserver({
			refs: [resizeBox],
			onResize: (size) => {
				setResizeBoxWidth(size.width);
				setResizeBoxHeight(size.height);
				setBoxSize(
					Math.min(
						boxSize(),
						vertical() ? size.width - props.right : size.height - props.left
					)
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

		setBoxSize(
			Math.min(
				Math.max(props.left, newSize),
				vertical()
					? resizeBoxWidth() - props.right
					: resizeBoxHeight() - props.left
			)
		);
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
				"min-width": props.left + props.right + 8 + "px",
				"grid-template-columns": `${boxSize()}px 8px auto`,
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
