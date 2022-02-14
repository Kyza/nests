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

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	console.log("aaaaa", request, sender, sendResponse);
// });

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

	message.data = serialize(message.data);

	chrome.runtime.sendMessage(message);
});

function set(obj, path, value) {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (current[path[i]] == null) current[path[i]] = {};
		current = current[path[i]];
	}
	current[path[path.length - 1]] = value;
	return obj;
}

function serialize(object) {
	const result = Array.isArray(object) ? [] : {};
	walkTree(object, (value, path) => {
		if (value instanceof RegExp) {
			return set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "RegExp",
					value: value.toString(),
				},
			});
		}
		if (value instanceof Date)
			return set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Date",
					value: value.toISOString(),
				},
			});
		if (value instanceof Map)
			return set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Map",
					value: serialize(Object.fromEntries(value.entries())),
				},
			});
		if (value instanceof Set)
			return set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Set",
					value: serialize([...value]),
				},
			});
		if (value instanceof Function)
			return set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "RegExp",
					value: value.toString(),
				},
			});
		if (path.length > 0) set(result, path, value);
	});
	return result;
}

function walkTree(obj, callback) {
	const walk = (value, path) => {
		callback(value, [...path]);
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				walk(value[i], [...path, i]);
			}
		} else if (typeof value === "object" && value !== null) {
			for (const key of Reflect.ownKeys(value)) {
				walk(value[key], [...path, key]);
			}
		}
	};
	walk(obj, []);
}
