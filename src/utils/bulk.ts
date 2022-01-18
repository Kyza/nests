import { Events } from "..";
import emitUp from "../lib-utils/emitUp";
import { BulkListenerData } from "../lib-utils/makeEmitter";
import make from "../make";
import { eventEmittersSymbol, pathSymbol } from "../symbols";
import options from "./options";
import target from "./target";
import on from "./on";

export default function bulk<Data extends object>(
	nest: Data,
	callback: (nest: Data) => true | void,
	transient = false
) {
	const stackedEvents: BulkListenerData = {
		event: Events.BULK,
		path: nest[pathSymbol],
		value: [],
	};

	// Clone the state and set up a nest that stacks the events.
	const transientNest = make(target(nest), options(nest));

	// Set up the event emitters to catch the events to emit later.
	console.log(Events, Object.values(Events));

	on(Object.values(Events), transientNest, (data) => {
		stackedEvents.value.push(data);
	});

	// Run the bulk operation with the nestAccessors.
	const cancel = callback(transientNest);

	if (cancel) return;

	// Set the state all in one go.
	Object.assign(target(nest), transientNest);

	if (!transient) {
		// Run bulk event.
		emitUp<Events.BULK>(nest[eventEmittersSymbol], stackedEvents);
	}
}
