import { Events } from "..";
import emitUp from "../lib-utils/emitUp";
import { BulkListenerData } from "../lib-utils/makeEmitter";
import make from "../make";
import { eventEmittersSymbol, pathSymbol } from "../symbols";
import nestOptions from "./options";
import target from "./target";
import on from "./on";
import getDifferences from "../lib-utils/getDifferences";
import pathStringMaker from "../lib-utils/pathStringMaker";
import Nest from "../Nest";

export default function bulk<Data extends object>(
	nest: Nest<Data>,
	callback: (nest: Nest<Data>) => true | void,
	options: {
		transient?: boolean;
		diff?: boolean;
	} = {
		transient: false,
		diff: true,
	}
) {
	options ??= {};
	options.transient ??= false;
	options.diff ??= true;

	const stackedEvents: BulkListenerData = {
		event: Events.BULK,
		path: nest[pathSymbol],
		value: [],
	};

	// Clone the state and set up a nest that stacks the events.
	const transientNest = make(target(nest), nestOptions(nest));

	// Set up the event emitters to catch the events to emit later.
	on(Object.values(Events), transientNest, (data) => {
		stackedEvents.value.push(data);
	});

	// Run the bulk operation with the nestAccessors.
	const cancel = callback(transientNest);

	if (cancel) return;

	if (options.diff) {
		// Remove the extra events that can be diffed out.
		const difference = getDifferences(nest, transientNest);
		stackedEvents.value = stackedEvents.value.filter((data) =>
			difference.has(pathStringMaker(data.path))
		);
	}

	// Set the state all in one go.
	Object.assign(target(nest), transientNest);

	// Only run if it's not transient and if there are events to emit.
	if (!options.transient && stackedEvents.value.length > 0) {
		// Run bulk event.
		emitUp<Events.BULK>(nest[eventEmittersSymbol], stackedEvents);
	}
}
