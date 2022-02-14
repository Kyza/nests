import { createMemo, createSignal, For } from "solid-js";
import type { Component } from "solid-js";

const ToggleButton = (props) => {
	return (
		<input
			type="button"
			class={`duration-300 bg-[#cfd0d011] hover:(bg-[#cfd0d027]) rounded-xl p-2 m-1 cursor-pointer ${
				props.selected ? "!bg-[#cfd0d044]" : ""
			}`}
			value={props.children}
			{...props}
		/>
	);
};

export default ToggleButton;
