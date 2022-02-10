/// <reference types="chrome" />
import "windi.css";

import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import App from "./app";

import "./index.css";

import AllStores from "./stores/AllStores";
const { stores, setStores } = AllStores;

// Create the devtools panel.
chrome.devtools.panels.create("Nests", null, "/", function (panel) {
	const tabID = chrome.devtools.inspectedWindow.tabId;

	console.log("tabID", tabID, chrome);

	setTimeout(() => {
		console.log(chrome);
	}, 1000);

	chrome.runtime.onMessage.addListener(function (
		request,
		sender,
		sendResponse
	) {
		if (sender.tab.id === tabID) {
			console.log("message received", request, sender, sendResponse);
			switch (request.type) {
				case "PROBE":
					document.body.innerHTML = JSON.stringify(request);
					break;
				case "UPDATE":
					setStores((stores) => {
						const store = stores[request.id] || { history: [] };
						return {
							...stores,
							[request.id]: {
								...store,
								history: [...store.history, request.data],
							},
						};
					});
					break;
			}
		}
	});
});

render(
	() => (
		<Router>
			<App />
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
