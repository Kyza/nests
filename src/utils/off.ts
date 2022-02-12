import Events from "../Events";
import { eventEmittersSymbol } from "../symbols";
import { ListenerFunction } from "../lib-utils/makeEmitter";
import pathStringMaker from "../lib-utils/pathStringMaker";
import Nest from "../Nest";

export default function off<Data extends object>(
	events: Events | Events[],
	nest: Nest<Data> | [Nest<Data>, PropertyKey],
	func: ListenerFunction<Nest<Data>>
) {
	const pathString = pathStringMaker(nest);
	if (Array.isArray(nest)) nest = nest[0];

	const emitter = nest[eventEmittersSymbol]?.[pathString];
	if (emitter == null) return;

	emitter.off(events, func);
}
