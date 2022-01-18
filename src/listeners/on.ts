import Events from "../Events";
import { eventEmittersSymbol, pathSymbol } from "../symbols";
import makeEmitter, { ListenerFunction } from "../utils/EventEmitter";
import symbolJoin from "../utils/symbolJoin";

export default function on<Data>(
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

	let emitter = obj[eventEmittersSymbol]?.[pathString];
	if (emitter == null) {
		emitter = obj[eventEmittersSymbol][pathString] = makeEmitter();
	}

	emitter.on(events, func);
	return () => emitter.off(events, func);
}
