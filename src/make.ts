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
import Nest from "./Nest.js";
import isDifferent from "./lib-utils/isDifferent.js";
import walkTree from "./lib-utils/walkTree.js";
import pathStringMaker from "./lib-utils/pathStringMaker.js";
import { deep, silent } from "./utils/index.js";

export type NestOptions = {
	cloner?:
		| { deep?: boolean; function?: (value: any) => any }
		| ((value: any) => any);
};
export type DeepNestOptions = {
	deep?: boolean;
	silent?: boolean;
	target?: boolean;
};

const deepNestCache = new WeakMap<object, any>();

export default function make<Data extends object>(
	data: Data = {} as Data,
	options: NestOptions = {}
): Nest<Data> {
	if (!(deepSymbol in data)) {
		data = deep(data);
	}
	if (!(silentSymbol in data)) {
		data = silent(data);
	}

	const nestOptions = options;
	if (typeof options.cloner === "function") {
		options.cloner = {
			deep: false,
			function: options.cloner,
		};
	} else {
		options.cloner ??= { deep: false };
		options.cloner.deep ??= false;
	}

	// Only pass what's needed.
	const cloneFunction = (value: any) =>
		// There's gotta be a better way to set a variable to a type. My eyes are bleeding.
		(options.cloner as any).deep
			? (options.cloner as any).function(value)
			: deepClone(value, (options.cloner as any).function);

	const emitters: {
		[key: string]: EventEmitter;
	} = {};
	const allDefaultDeepNestOptions: {
		[key: string]: DeepNestOptions;
	} = {};

	// Set up the default nesting options for each path.
	const symbolSettings = [
		["target", targetSymbol],
		["silent", silentSymbol],
		["deep", deepSymbol],
	];
	walkTree(data, (node, path) => {
		if (typeof node === "object") {
			const pathString = pathStringMaker(path);
			// If one of the symbols is set, set it in the pathData.
			for (let i = 0; i < symbolSettings.length; i++) {
				const [name, symbol] = symbolSettings[i];
				if (symbol in node) {
					allDefaultDeepNestOptions[pathString] ??= {};
					Object.assign(allDefaultDeepNestOptions[pathString], {
						[name]: node[symbol],
					});
				}
			}
		}
	});

	let internalData: Data;
	function wrapRoot(value: Data) {
		return Object.assign((newValue: Data) => {
			// Make sure symbols don't get removed because Object.assign doesn't do this.
			const wrappedNew = wrapRoot(newValue);
			const allKeys = [
				...new Set([
					...Reflect.ownKeys(internalData),
					...Reflect.ownKeys(wrappedNew),
				]),
			];
			for (let i = 0; i < allKeys.length; i++) {
				// Some of the keys are read only.
				try {
					// Prefer the new value.
					internalData[allKeys[i]] =
						wrappedNew[allKeys[i]] ?? internalData[allKeys[i]];
				} catch {}
			}
		}, value);
	}
	internalData = wrapRoot(data);

	function getDeepNestOptions(value: any, previous: DeepNestOptions) {
		if (typeof value !== "object")
			return Object.assign(allDefaultDeepNestOptions[""], previous);

		// Loop up the path and get the highest default deepNestOptions.
		const defaultDeepNestOptions: DeepNestOptions = {};

		if (deepSymbol in value) {
			defaultDeepNestOptions.deep = value[deepSymbol];
		}
		if (silentSymbol in value) {
			defaultDeepNestOptions.silent = value[silentSymbol];
		}
		if (targetSymbol in value) {
			defaultDeepNestOptions.target = value[targetSymbol];
		}

		const prioritizedOptions = allDefaultDeepNestOptions[""];
		Object.assign(prioritizedOptions, previous);
		Object.assign(prioritizedOptions, defaultDeepNestOptions);

		return prioritizedOptions;
	}

	function makeDeepNest<Data extends object>(
		target: any,
		root: any,
		path: (string | number | symbol)[],
		options: DeepNestOptions = {}
	): Data {
		if (options.target) return target;
		if (deepNestCache.has(target)) {
			return deepNestCache.get(target);
		}

		const deepNest = new Proxy(target, {
			get(target, key: string | number | symbol) {
				const newPath: (string | number | symbol)[] = [...path, key];
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
					default:
						// Not a predefined symbol.
						let value = Reflect.get(
							// @ts-ignore This is literally how it's meant to be used but ok.
							...arguments
						);

						if (value != null) {
							if (typeof value === "object") {
								const deepNestOptions: DeepNestOptions = getDeepNestOptions(
									value,
									{ ...options }
								);
								if (deepNestOptions.target) return value;
								return makeDeepNest(
									value,
									root,
									newPath,
									// The normal options should override the defaultDeepNestOptions.
									deepNestOptions
								);
							}
							return value;
						}

						const deepNestOptions = getDeepNestOptions(target, { ...options });
						if (!deepNestOptions.target && deepNestOptions.deep) {
							return makeDeepNest(
								{},
								root,
								newPath,
								// The normal options should override the defaultDeepNestOptions.
								deepNestOptions
							);
						}

						return value;
				}
			},
			set(target, key, value) {
				const newPath = [...path, key];
				const oldValue = target[key];

				// Place the target onto the root in the correct path so that reflection can work properly.
				root = set(root, [...path], target);
				Reflect.set(
					// @ts-ignore This is literally how it's meant to be used but ok.
					...arguments
				);

				const deepNestOptions = getDeepNestOptions(target, { ...options });
				if (!deepNestOptions.silent && isDifferent(oldValue, value)) {
					emitUp<Events.SET>(emitters, {
						event: Events.SET,
						path: newPath,
						value,
					});
				}
				// This needs to return true or it errors. /shrug
				return true;
			},
			deleteProperty(_target, key) {
				const deepNestOptions = getDeepNestOptions(target, {
					...options,
				});
				if (
					Reflect.deleteProperty(
						// @ts-ignore This is literally how it's meant to be used but ok.
						...arguments
					) &&
					!deepNestOptions.silent
				) {
					emitUp(emitters, {
						event: Events.DELETE,
						path: [...path, key],
					});
					return true;
				}
				return false;
			},
			has(target, key) {
				// Don't use Reflect because it should be silent.
				if (key === targetSymbol) return true;
				if (
					typeof target[key] === "object" &&
					Object.keys(target[key]).length === 0
				) {
					return false;
				}
				return key in target;
			},
		});

		deepNestCache.set(target, deepNest);

		return deepNest;
	}

	return makeDeepNest(internalData, internalData, []);
}
