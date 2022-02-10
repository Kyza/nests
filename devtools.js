let tabId;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (sender.tab.id === tabId) {
		console.log("message received", request, sender, sendResponse);
		switch (request.type) {
			case "PROBE":
				document.body.innerHTML = JSON.stringify(request);
		}
	}
});

chrome.devtools.panels.create("Nests", null, "devtools.html", function (panel) {
	tabId = chrome.devtools.inspectedWindow.tabId;
	console.log("Created panel", panel);
});