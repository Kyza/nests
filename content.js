// code invoked on panel creation
// Create a connection to the background page
// const backgroundPageConnection = chrome.runtime.connect({
// 	name: "nests-devtools-page",
// });

// backgroundPageConnection.onMessage.addListener(function (message) {
// 	document.body.innerHTML = JSON.stringify(message);
// 	console.log("a", message);
// 	// Handle responses from the background page, if any
// });

// // Relay the tab ID to the background page
// backgroundPageConnection.postMessage({
// 	name: "init",
// 	tabId: chrome.devtools.inspectedWindow.tabId,
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("aaaaa", request, sender, sendResponse);
});

// Listen to the messages from the actual page and send them to the devtools panel.
window.addEventListener("message", function windowListener(event) {
	// Only accept messages from the same frame
	if (event.source !== window) {
		return;
	}

	const message = event.data;

	// Only accept messages that we know are ours
	if (
		typeof message !== "object" ||
		message === null ||
		!message.source === "nests-devtools-extension"
	) {
		return;
	}

	if (message.type === "PROBE") {
		event.source.postMessage(
			{ type: "PROBE_RETURN", source: "nests-devtools-extension" },
			event.origin
		);
	}

	chrome.runtime.sendMessage(message);
});
