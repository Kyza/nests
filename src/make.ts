import Events from "./Events";
import deepClone from "./utils/deepClone";
import DeepNest from "./utils/DeepNest";
import EventEmitter, { EventStack } from "./EventEmitter";
import Nest from "./Nest";

export type NestOptions<Data> = {
	nestArrays?: boolean;
	clone?: (obj: Data) => Data;
};

export default function make<Data extends object>(
	data: Data = {} as Data,
	options: NestOptions<Data> = {}
): Nest<Data> {
	const cloner = options.clone ?? deepClone;
	let internalData = cloner(data);
	const emitter = new EventEmitter();

	const emitterTraps = {
		set(_target: any, _key: string, path: string[], value: any) {
			emitter.emit(Events.SET, {
				path,
				value,
			});
		},
		deleteProperty(_target: any, _key: string, path: string[]) {
			emitter.emit(Events.DELETE, {
				path,
			});
		},
	};

	return {
		get store() {
			return DeepNest(internalData, internalData, [], options, emitterTraps);
		},
		set store(value) {
			internalData = value;
		},
		get state() {
			return internalData;
		},
		set state(value) {
			internalData = value;
		},
		get ghost() {
			return DeepNest(internalData, internalData, [], options);
		},
		set ghost(value) {
			internalData = value;
		},
		//
		bulk: function (callback, transient = false) {
			const stackedEvents: EventStack = [];

			// Clone the state and set up a nest that stacks the events.
			const stateClone = cloner(internalData);
			const nestAccessors = {
				store: DeepNest(stateClone, stateClone, [], options, {
					set(_target, _key, path, value) {
						stackedEvents.push({ event: Events.SET, path, value });
					},
					deleteProperty(_target, _key, path) {
						stackedEvents.push({ event: Events.DELETE, path });
					},
				}),
				state: stateClone,
				ghost: DeepNest(stateClone, stateClone, [], options),
			};

			// Run the callback with the nestAccessors.
			callback(nestAccessors);

			// Set the state all in one go.
			internalData = stateClone;

			// Run the events.
			if (!transient) {
				// Run compile event.
				emitter.emit<Events.BULK>(Events.BULK, stackedEvents);
				// Run the normal stacked events.
				for (const { event, path, value } of stackedEvents) {
					emitter.emit(event, {
						path,
						value,
					});
				}
			}
		},
		on: emitter.on.bind(emitter),
		once: emitter.once.bind(emitter),
		off: emitter.off.bind(emitter),
		emitter,
	};
}
