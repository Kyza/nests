import Events from "../Events";
import { eventEmittersSymbol, pathSymbol } from "../symbols";
import { ListenerFunction } from "../utils/EventEmitter";
import symbolJoin from "../utils/symbolJoin";

export default function off<Data>(
	events: Events | Events[],
	obj: Data | [Data, string | symbol],
	func: ListenerFunction<Data>
) {
	let key: string | symbol | (string | symbol)[];
	if (Array.isArray(obj)) {
		[obj, ...key] = obj;
		key = symbolJoin(key as (string | symbol)[], ".");
	}

	const pathArray = obj[pathSymbol];

	// I can't use .join because it fails on symbols because JavaScript.
	const pathString =
		symbolJoin(pathArray, ".") +
		(key != null ? `${pathArray.length === 0 ? "" : "."}${key as string}` : "");

	const emitter = obj[eventEmittersSymbol]?.[pathString];
	if (emitter == null) return;

	emitter.off(events, func);
}
