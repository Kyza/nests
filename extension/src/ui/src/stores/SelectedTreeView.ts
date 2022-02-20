import { createSignal } from "solid-js";

const [selectedTreeView, setSelectedTreeView] = createSignal("tree");

export { selectedTreeView, setSelectedTreeView };
