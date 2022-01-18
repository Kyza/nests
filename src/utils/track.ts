import * as nests from "..";
import Events from "../Events";
import on from "./on";
import symbolJoin from "../lib-utils/symbolJoin";
import set from "./set";
import target from "./target";

export default function track(
	nest: object,
	options: {
		name?: string;
		latency?: number;
		maxAge?: number;
		trace?: boolean;
		traceLimit?: number;
		actionCreators?: object;
	} = {}
) {
	if (window?.hasOwnProperty("__REDUX_DEVTOOLS_EXTENSION__")) {
		// @ts-ignore
		const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
		devTools.init(target(nest));

		devTools.subscribe((message) => {
			console.log(message);
			switch (message.type) {
				case "DISPATCH":
					switch (message.payload?.type) {
						case "RESET":
							set(nest, target(nest));
							devTools.init(target(nest));
							break;
						case "COMMIT":
							devTools.init(target(nest));
							break;
						case "ROLLBACK":
							const parsedState = JSON.parse(message.state ?? "{}");
							set(nest, parsedState);
							devTools.init(parsedState);
							break;
						default:
							break;
					}
					break;
				case "ACTION":
					if (typeof message.payload === "string") {
						new Function("nests", message.payload).call(nest, nests);
					} else {
						options.actionCreators[message.payload.name]?.apply(
							nest,
							message.payload.args
						);
					}
					break;
			}
		});

		on(
			[Events.UPDATE, Events.APPLY, Events.BULK, Events.DELETE, Events.SET],
			nest,
			(data) => devTools.send(symbolJoin(data.path, "."), target(nest))
		);
	} else {
		console.warn("[Nests] Redux DevTools not found.");
	}
}
