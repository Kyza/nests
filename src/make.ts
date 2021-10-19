import Events from "./Events";
import deepClone from "./deepClone";
import DeepNest from "./DeepNest";
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
	let internalData = options.clone?.(data) ?? deepClone(data);
	const emitter = new EventEmitter();

	const emitterTraps = {
		set(_target, _key, path, value) {
			emitter.emit(Events.SET, {
				path,
				value,
			});
		},
		deleteProperty(_target, _key, path) {
			emitter.emit(Events.DELETE, {
				path,
			});
		},
	};

	return new Proxy<Nest<Data>>(
		{
			get store() {
				return DeepNest(internalData, internalData, [], options, emitterTraps);
			},
			set store(value) {
				internalData = value;
			},
			// This can be safely ignored, the Data will always be an object or it won't work anyway.
			// @ts-ignore
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
				const stateClone = options.clone?.(data) ?? deepClone(data);
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
						switch (event) {
							case Events.SET:
								emitter.emit(Events.SET, {
									path,
									value,
								});
								break;
							default:
								emitter.emit(Events.DELETE, {
									path,
								});
								break;
						}
					}
				}
			},
			on: emitter.on.bind(emitter),
			once: emitter.once.bind(emitter),
			off: emitter.off.bind(emitter),
			emitter,
		},
		{
			set(target, key, value) {
				switch (key) {
					case "store":
					case "state":
					case "ghost":
						internalData = value;
					default:
						target[key] = value;
						break;
				}
				return true;
			},
		}
	);
}
