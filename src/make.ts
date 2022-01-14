import Events from "./Events.js";
import EventEmitter from "./utils/EventEmitter.js";
import { BulkOptions } from "./Nest.js";
import deepClone from "./utils/deepClone.js";

import set from "./utils/set.js";

import {
	eventEmittersSymbol,
	shallowSymbol,
	pathSymbol,
	originalSymbol,
	silentSymbol,
	deepSymbol,
	loudSymbol,
} from "./symbols.js";

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
): Data {
	// No shenanigans.
	options = deepClone(options);

	// Set default options.
	options.nestArrays ??= true;
	options.nestClasses ??= true;
	const nestOptions = options;

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

	const emitters: {
		[key: string]: EventEmitter;
	} = {};

	function DeepNest<Data extends object>(
		target: any,
		root: any,
		path: (string | symbol)[],
		options: { deep?: boolean; silent?: boolean } = {}
	): Data {
		options.deep ??= true;
		options.silent ??= false;

		const nestTraps: ProxyHandler<Data> = {
			get(target, key: string | symbol) {
				const newPath: (string | symbol)[] = [...path, key];

				switch (key) {
					case eventEmittersSymbol:
						return emitters;
					case pathSymbol:
						return [...path];
					case shallowSymbol:
						return DeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { deep: false })
						);
					case deepSymbol:
						return DeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { deep: true })
						);
					case silentSymbol:
						return DeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { silent: true })
						);
					case loudSymbol:
						return DeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { silent: false })
						);
					case originalSymbol:
						return target;
				}

				let value = target[key];
				if (value != null) {
					if (!nestOptions.nestArrays && Array.isArray(value)) {
						return value;
					}
					if (
						typeof value === "object" &&
						(nestOptions.nestClasses || value.constructor === Object)
					) {
						return DeepNest(value, root, newPath, options);
					}
					return value;
				}

				if (options.deep) {
					return DeepNest({}, root, newPath, options);
				}

				return value;
			},
			set(_target, key, value) {
				const newPath = [...path, key];
				root = set(root, newPath, value);

				if (!options.silent) {
					const emitData = {
						event: Events.SET,
						path: newPath,
						value,
					};
					// Emit to the base nest listeners.
					emitters[""]?.emit<Events.SET>(Events.SET, emitData);
					// Emit up the chain.
					let emitterPaths = "";
					for (let i = 0; i < newPath.length; i++) {
						emitterPaths += (i === 0 ? "" : ".") + newPath[i].toString();
						emitters[emitterPaths]?.emit<Events.SET>(Events.SET, emitData);
					}
				}

				// This needs to return true or it errors. /shrug
				return true;
			},
			deleteProperty(target, key) {
				if (delete target[key] && !options.silent) {
					const newPath = [...path, key];
					const emitData = {
						event: Events.SET,
						path: newPath,
					};
					// Emit to the base nest listeners.
					emitters[""]?.emit<Events.DELETE>(Events.DELETE, emitData);
					// Emit up the chain.
					let emitterPaths = "";
					for (let i = 0; i < newPath.length; i++) {
						emitterPaths += (i === 0 ? "" : ".") + newPath[i].toString();
						emitters[emitterPaths]?.emit<Events.DELETE>(
							Events.DELETE,
							emitData
						);
					}
					return true;
				}
				return false;
			},
			apply(target, thisArg, args) {
				const value = (target as Function).apply(thisArg, args);

				if (!options.silent) {
					const emitData = {
						event: Events.SET,
						path: [...path],
						value,
					};
					// Emit to the base nest listeners.
					emitters[""]?.emit<Events.SET>(Events.SET, emitData);
					// Emit up the chain.
					let emitterPaths = "";
					for (let i = 0; i < path.length; i++) {
						emitterPaths += (i === 0 ? "" : ".") + path[i].toString();
						emitters[emitterPaths]?.emit<Events.SET>(Events.SET, emitData);
					}
				}

				return value;
			},
			has(target, key) {
				if (
					typeof target[key] === "object" &&
					Object.keys(target[key]).length === 0
				) {
					return false;
				}
				return key in target;
			},
		};

		return new Proxy(target, nestTraps);
	}

	return DeepNest(internalData, internalData, []);

	// return {
	// 	get store() {
	// 		return DeepNest<Data>(internalData, internalData, [], options, {
	// 			set(_target, _key, path, value) {
	// 				emitter.emit<Events.SET>(Events.SET, {
	// 					event: Events.SET,
	// 					path,
	// 					value,
	// 				});
	// 			},
	// 			deleteProperty(_target, _key, path) {
	// 				emitter.emit(Events.DELETE, {
	// 					event: Events.DELETE,
	// 					path,
	// 				});
	// 			},
	// 			apply(_target, _key, path, thisArg, args, value) {
	// 				emitter.emit<Events.APPLY>(Events.APPLY, {
	// 					event: Events.APPLY,
	// 					path,
	// 					thisArg,
	// 					args,
	// 					value,
	// 				});
	// 			},
	// 		});
	// 	},
	// 	set store(value) {
	// 		Object.assign(internalData, cloneFunction(value));
	// 	},
	// 	get state() {
	// 		return internalData;
	// 	},
	// 	set state(value) {
	// 		Object.assign(internalData, cloneFunction(value));
	// 	},
	// 	get ghost() {
	// 		return DeepNest<Data>(internalData, internalData, [], options);
	// 	},
	// 	set ghost(value) {
	// 		Object.assign(internalData, cloneFunction(value));
	// 	},
	// 	bulk: function (callback, transient = false) {
	// 		const stackedEvents: BulkListenerData = [];

	// 		// Clone the state and set up a nest that stacks the events.
	// 		const stateClone = cloneFunction(internalData);

	// 		// Run the bulk operation with the nestAccessors.
	// 		const shouldCancel = callback({
	// 			store: DeepNest(stateClone, stateClone, [], options, {
	// 				set(_target, _key, path, value) {
	// 					stackedEvents.push({ event: Events.SET, path, value });
	// 				},
	// 				deleteProperty(_target, _key, path) {
	// 					stackedEvents.push({ event: Events.DELETE, path });
	// 				},
	// 				apply(_target, _key, path, thisArg, args, value) {
	// 					stackedEvents.push({
	// 						event: Events.APPLY,
	// 						path,
	// 						thisArg,
	// 						args,
	// 						value,
	// 					});
	// 				},
	// 			}),
	// 			state: stateClone,
	// 			ghost: DeepNest(stateClone, stateClone, [], options),
	// 		});

	// 		if (shouldCancel) return;

	// 		// Set the state all in one go.
	// 		Object.assign(internalData, stateClone);

	// 		if (!transient) {
	// 			// Run bulk event.
	// 			emitter.emit<Events.BULK>(Events.BULK, stackedEvents);
	// 		}
	// 	},
	// 	on: emitter.on.bind(emitter),
	// 	once: emitter.once.bind(emitter),
	// 	off: emitter.off.bind(emitter),
	// 	clone: function () {
	// 		return cloneFunction(internalData);
	// 	},
	// 	emitter,
}
