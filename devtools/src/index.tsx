/// <reference types="chrome" />
import "windi.css";

import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import App from "./app";

import "./index.css";

import type { TrackedStore } from "./stores/StoreData";
import { stores, setStores } from "./stores/StoreData";
import deepFreeze from "./utils/deepFreeze";
import { selectedStore, setSelectedStore } from "./stores/SelectedStore";
import ResolvedStack from "./utils/ResolvedStack";

// Fix wrong starting URL.
window.history.replaceState({}, "", "/");

// Create the devtools panel.
chrome.devtools.panels.create(
	"Nests",
	null,
	"/devtools/dist/index.html",
	function (panel) {
		const tabID = chrome.devtools.inspectedWindow.tabId;

		chrome.runtime.onMessage.addListener(function (
			request: {
				id: string;
				type: string;
				name: string;
				source: string;
				data: TrackedStore;
				stack: ResolvedStack;
			},
			sender,
			sendResponse
		) {
			if (
				sender.tab.id === tabID &&
				request.source === "nests-devtools-extension"
			) {
				switch (request.type) {
					case "INIT":
						// This is *really* for resetting stores when they are recreated.
						// So... Reset the history.
						setStores((stores) => {
							stores[request.id] = {
								history: [
									{
										name: "INIT",
										time: new Date(),
										data: request.data,
									},
								],
							};
							return stores;
						});
						break;
					case "UPDATE":
						// If the store doesn't exist, create it.
						// TODO: Show a warning if the store hasn't been created when calling this. That means it hasn't done INIT which could cause problems with hot module reloaders.
						setStores((stores) => {
							const store: TrackedStore = stores[request.id];
							if (store == null) {
								console.warn(
									`[Nests DevTools] Store "${request.id}" updated before creation.`
								);
								return stores;
							}
							store.history.push({
								name: request.name,
								time: new Date(),
								data: request.data,
							});
							return stores;
						});
						break;
					case "DESTROY":
						setStores((stores) => {
							delete stores[request.id];
							if (selectedStore() === request.id) {
								window.history.pushState({}, "", "/");
								setSelectedStore(null);
							}
							return stores;
						});
				}
			}
		});
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
