import * as nests from "..";
import Events from "../Events";
import on from "./on";
import symbolJoin from "../lib-utils/symbolJoin";
import target from "./target";
import copy from "./copy";
import Nest from "../Nest";

export default function track<Data extends object>(
	nest: Nest<Data>,
	options: {
		name?: string;
		latency?: number;
		maxAge?: number;
		trace?: boolean;
		traceLimit?: number;
		actionCreators?: object;
	} = {}
): Function {
	if (window?.hasOwnProperty("__REDUX_DEVTOOLS_EXTENSION__")) {
		const original = copy(nest);
		// @ts-ignore
		const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
		devTools.init(target(nest));

		devTools.subscribe((message) => {
			switch (message.type) {
				case "DISPATCH":
					switch (message.payload?.type) {
						case "RESET":
							Object.assign(nest, original);
							devTools.init(original);
							break;
						case "COMMIT":
							devTools.init(target(nest));
							break;
						case "ROLLBACK":
							const parsedState = JSON.parse(message.state ?? "{}");
							Object.assign(nest, parsedState);
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

		return on(Object.values(Events), nest, (data) => {
			const name = symbolJoin(data.path, ".");
			devTools.send(name.length === 0 ? "this" : `this.${name}`, target(nest));
		});
	} else {
		console.warn("[Nests] Redux DevTools not found.");
	}
}
