// // Sending messages.
// const connections = {};

// chrome.runtime.onConnect.addListener(function (port) {
// 	if (port.name === "nests-devtools-page") {
// 		console.log("Connected to port", port);
// 		function extensionListener(message, sender, sendResponse) {
// 			console.log("message received", message);
// 			// The original connection event doesn't include the tab ID of the
// 			// DevTools page, so we need to send it explicitly.
// 			if (message.name === "init" && message.tabId != null) {
// 				console.log("Exectuing init");
// 				connections[message.tabId] = port;
// 				chrome.scripting.executeScript({
// 					target: { tabId: message.tabId },
// 					files: ["content/main.js"],
// 					world: "MAIN",
// 				});
// 				chrome.scripting.executeScript({
// 					target: { tabId: message.tabId },
// 					files: ["content/isolated.js"],
// 					world: "ISOLATED",
// 				});
// 			}
// 		}

// 		// Listen to messages sent from the DevTools page
// 		port.onMessage.addListener(extensionListener);

// 		port.onDisconnect.addListener(function (port) {
// 			port.onMessage.removeListener(extensionListener);

// 			const tabs = Object.keys(connections);
// 			for (const i = 0, len = tabs.length; i < len; i++) {
// 				if (connections[tabs[i]] == port) {
// 					delete connections[tabs[i]];
// 					break;
// 				}
// 			}
// 		});
// 	}
// });

// // Route window messages to the correct connection.
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	console.log("message received", request);
// 	// Messages from content scripts should have sender.tab set
// 	if (sender.tab) {
// 		const tabId = sender.tab.id;
// 		if (tabId in connections) {
// 			connections[tabId].postMessage(request);
// 			console.log("Found");
// 		} else {
// 			console.log("Tab not found in connection list.");
// 		}
// 	} else {
// 		console.log("sender.tab not defined.");
// 	}
// 	return true;
// });
