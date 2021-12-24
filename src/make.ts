import Events from "./Events.js";
import DeepNest from "./utils/DeepNest.js";
import EventEmitter, { BulkListenerData } from "./EventEmitter.js";
import Nest, { BulkOptions } from "./Nest.js";
import deepClone from "./utils/deepClone.js";

export type NestOptions<Data> = {
	bulks?: BulkOptions<Data>;
	nestArrays?: boolean;
	nestClasses?: boolean;
	initialClone?: boolean;
	cloner?:
		| { deep?: boolean; function: (value: any) => any }
		| ((value: any) => any);
};

export default function make<Data extends object>(
	data: Data = {} as Data,
	options: NestOptions<Data> = {}
): Nest<Data> {
	// No shenanigans.
	options = deepClone(options);

	// Set default options.
	options.nestArrays ??= true;
	options.nestClasses ??= true;

	if (typeof options.cloner === "function") {
		options.cloner = {
			deep: false,
			function: options.cloner,
		};
	} else {
		options.cloner ??= { deep: false, function: () => null };
		options.cloner.deep ??= false;
		options.cloner.function ??= () => null;
	}

	options.initialClone ??= true;

	// Only pass what's needed.
	const cloneFunction = (value: any) =>
		// There's gotta be a better way to set a variable to a type. My eyes are bleeding.
		(options.cloner as any).deep
			? (options.cloner as any).function(value)
			: deepClone(value, (options.cloner as any).function);

	let internalData = options.initialClone ? cloneFunction(data) : data;

	const emitter = new EventEmitter();

	return {
		get store() {
			return DeepNest<Data>(internalData, internalData, [], options, {
				set(_target, _key, path, value) {
					emitter.emit<Events.SET>(Events.SET, {
						event: Events.SET,
						path,
						value,
					});
				},
				deleteProperty(_target, _key, path) {
					emitter.emit(Events.DELETE, {
						event: Events.DELETE,
						path,
					});
				},
				apply(_target, _key, path, thisArg, args, value) {
					emitter.emit<Events.APPLY>(Events.APPLY, {
						event: Events.APPLY,
						path,
						thisArg,
						args,
						value,
					});
				},
			});
		},
		set store(value) {
			Object.assign(internalData, cloneFunction(value));
		},
		get state() {
			return internalData;
		},
		set state(value) {
			Object.assign(internalData, cloneFunction(value));
		},
		get ghost() {
			return DeepNest<Data>(internalData, internalData, [], options);
		},
		set ghost(value) {
			Object.assign(internalData, cloneFunction(value));
		},
		bulk: function (callback, transient = false) {
			const stackedEvents: BulkListenerData = [];

			// Clone the state and set up a nest that stacks the events.
			const stateClone = cloneFunction(internalData);

			// Run the bulk operation with the nestAccessors.
			const shouldCancel = callback({
				store: DeepNest(stateClone, stateClone, [], options, {
					set(_target, _key, path, value) {
						stackedEvents.push({ event: Events.SET, path, value });
					},
					deleteProperty(_target, _key, path) {
						stackedEvents.push({ event: Events.DELETE, path });
					},
					apply(_target, _key, path, thisArg, args, value) {
						stackedEvents.push({
							event: Events.APPLY,
							path,
							thisArg,
							args,
							value,
						});
					},
				}),
				state: stateClone,
				ghost: DeepNest(stateClone, stateClone, [], options),
			});

			if (shouldCancel) return;

			// Set the state all in one go.
			Object.assign(internalData, stateClone);

			if (!transient) {
				// Run bulk event.
				emitter.emit<Events.BULK>(Events.BULK, stackedEvents);
			}
		},
		on: emitter.on.bind(emitter),
		once: emitter.once.bind(emitter),
		off: emitter.off.bind(emitter),
		emitter,
	};
}
