import Events from "./Events.js";
import { EventEmitter } from "./lib-utils/makeEmitter.js";
import deepClone from "./lib-utils/deepClone.js";

import set from "./lib-utils/set.js";

import {
	eventEmittersSymbol,
	shallowSymbol,
	pathSymbol,
	targetSymbol,
	silentSymbol,
	deepSymbol,
	loudSymbol,
	clonerSymbol,
	optionsSymbol,
} from "./symbols.js";
import emitUp from "./lib-utils/emitUp.js";

export type NestOptions = {
	nestArrays?: boolean;
	nestClasses?: boolean;
	initialClone?: boolean;
	cloner?:
		| { deep?: boolean; function: (value: any) => any }
		| ((value: any) => any);
};

export default function make<Data extends object>(
	data: Data = {} as Data,
	options: NestOptions = {}
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

	function makeDeepNest<Data extends object>(
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
					case optionsSymbol:
						return nestOptions;
					case clonerSymbol:
						return cloneFunction;
					case shallowSymbol:
						return makeDeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { deep: false })
						);
					case deepSymbol:
						return makeDeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { deep: true })
						);
					case silentSymbol:
						return makeDeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { silent: true })
						);
					case loudSymbol:
						return makeDeepNest(
							target,
							root,
							[...path],
							Object.assign(options, { silent: false })
						);
					case targetSymbol:
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
						return makeDeepNest(value, root, newPath, options);
					}
					return value;
				}

				if (options.deep) {
					return makeDeepNest({}, root, newPath, options);
				}

				return value;
			},
			set(_target, key, value) {
				const newPath = [...path, key];
				root = set(root, newPath, value);

				if (!options.silent) {
					emitUp<Events.SET>(emitters, {
						event: Events.SET,
						path: newPath,
						value,
					});
				}

				// This needs to return true or it errors. /shrug
				return true;
			},
			deleteProperty(target, key) {
				if (delete target[key] && !options.silent) {
					emitUp(emitters, {
						event: Events.DELETE,
						path: [...path, key],
					});
					return true;
				}
				return false;
			},
			apply(target, thisArg, args) {
				const copiedArgs = [...args];
				const value = (target as Function).apply(thisArg, args);

				if (!options.silent) {
					emitUp<Events.APPLY>(emitters, {
						event: Events.APPLY,
						path: [...path],
						thisArg,
						args: copiedArgs,
						value,
					});
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

	return makeDeepNest(internalData, internalData, []);
}
