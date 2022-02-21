/// <reference types="chrome" />

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
		message.source !== "nests-devtools-extension"
	) {
		return;
	}

	if (message.type === "PROBE") {
		event.source.postMessage(
			{ type: "PROBE_RETURN", source: "nests-devtools-extension" },
			event.origin
		);
	}

	message.options ??= {};
	message.options.serialize ??= true;

	chrome.runtime.sendMessage(message);
});
