import Events from "../Events";
import { eventEmittersSymbol } from "../symbols";
import { ListenerFunction } from "../lib-utils/makeEmitter";
import pathStringMaker from "../lib-utils/pathStringMaker";

export default function off<Data extends object>(
	events: Events | Events[],
	nest: Data | [Data, string | symbol],
	func: ListenerFunction<Data>
) {
	const pathString = pathStringMaker(nest);
	if (Array.isArray(nest)) nest = nest[0];

	const emitter = nest[eventEmittersSymbol]?.[pathString];
	if (emitter == null) return;

	emitter.off(events, func);
}
