/// <reference types="chrome" />
import "windi.css";

import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import App from "./app";

import "./index.css";

// Create the devtools panel.
chrome.devtools.panels.create("Nests", null, "", function (_panel) {});

render(
	() => (
		<Router>
			<App />
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
