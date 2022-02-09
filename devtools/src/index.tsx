import "windi.css";

import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import App from "./app";

import "./index.css";

// Fix devtools starting on the wrong path.
window.history.pushState({}, "", "/");

// Create the devtools panel.
chrome.devtools.panels.create(
	"Nests",
	null,
	"http://localhost:3001/",
	function (panel) {
		// tabId = chrome.devtools.inspectedWindow.tabId;
		console.log("Created panel", panel);
	}
);

render(
	() => (
		<Router>
			<App />
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
