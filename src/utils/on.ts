import Events from "../Events";
import { eventEmittersSymbol } from "../symbols";
import makeEmitter, { ListenerFunction } from "../lib-utils/makeEmitter";
import pathStringMaker from "../lib-utils/pathStringMaker";

export default function on<Data extends object>(
	events: Events | Events[],
	nest: Data | [Data, string | symbol],
	func: ListenerFunction<Data>
) {
	const pathString = pathStringMaker(nest);
	if (Array.isArray(nest)) nest = nest[0];

	let emitter = nest[eventEmittersSymbol]?.[pathString];
	if (emitter == null) {
		emitter = nest[eventEmittersSymbol][pathString] = makeEmitter();
	}

	emitter.on(events, func);
	return () => emitter.off(events, func);
}
