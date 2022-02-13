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

export type NestBehavior<T = never> = [T] extends [never]
	?
			| {
					[targetSymbol]: true;
			  }
			| (Omit<
					{
						[key: PropertyKey]: NestBehavior;
					},
					typeof targetSymbol | typeof deepSymbol | typeof loudSymbol
			  > & {
					[targetSymbol]?: false;
					[deepSymbol]?: boolean;
					[loudSymbol]?: boolean;
			  })
	: never;

export type NestOptions = {
	behaviors?: NestBehavior;
	cloner?:
		| { deep?: boolean; function?: (value: any) => any }
		| ((value: any) => any);
};
export type DeepNestOptions = {
	deep?: boolean;
	loud?: boolean;
	target?: boolean;
};

const deepNestCache = new WeakMap<object, any>();

export default function make<Data extends object>(
	data: Data = {} as Data,
	options: NestOptions = {}
): Nest<Data> {
	const nestOptions = options;

	options.behaviors ??= {};
	options.behaviors[deepSymbol] ??= true;
	options.behaviors[loudSymbol] ??= true;
	options.behaviors[targetSymbol] ??= false;

	// This line exists because of a bug in the TypeScript compiler.
	if (options.behaviors?.[targetSymbol])
		throw new Error("Nest root cannot be a target.");

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
		["loud", loudSymbol],
		["deep", deepSymbol],
	];
	walkTree(options.behaviors, (node, path) => {
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

	let internalData = Object.assign((newValue: Data) => {
		// Make sure symbols
		const allKeys = [
			...new Set([
				...Reflect.ownKeys(internalData),
				...Reflect.ownKeys(newValue),
			]),
		];
		for (let i = 0; i < allKeys.length; i++) {
			// Some of the keys are read only.
			try {
				// Prefer the new value.
				internalData[allKeys[i]] =
					newValue[allKeys[i]] ?? internalData[allKeys[i]];
			} catch {}
		}
	}, data);

	function getDeepNestOptions(
		value: any,
		previous: DeepNestOptions,
		pathString: string
	) {
		if (typeof value !== "object")
			return Object.assign(allDefaultDeepNestOptions[""], previous);

		// Default to the root options.
		const prioritizedOptions = allDefaultDeepNestOptions[""];
		// Override those with the options from the parent.
		// This will be the parent's options because they are passed down through makeDeepNest.
		Object.assign(prioritizedOptions, previous);
		// Override those with the options from the current path.
		Object.assign(prioritizedOptions, allDefaultDeepNestOptions[pathString]);

		return prioritizedOptions;
	}

	function makeDeepNest<Data extends object>(
		target: any,
		root: any,
		path: PropertyKey[],
		options: DeepNestOptions = {}
	): Data {
		if (options.target) return target;
		if (deepNestCache.has(target)) {
			return deepNestCache.get(target);
		}

		const deepNest = new Proxy(target, {
			get(target, key: PropertyKey) {
				const newPath: PropertyKey[] = [...path, key];
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
									{ ...options },
									pathStringMaker(newPath)
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

						const deepNestOptions = getDeepNestOptions(
							target,
							{ ...options },
							pathStringMaker(newPath)
						);
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
				if (
					!Reflect.set(
						// @ts-ignore This is literally how it's meant to be used but ok.
						...arguments
					)
				) {
					// If the set failed, make sure an error is thrown.
					return false;
				}

				const deepNestOptions = getDeepNestOptions(
					target,
					{ ...options },
					pathStringMaker(newPath)
				);
				if (deepNestOptions.loud && isDifferent(oldValue, value)) {
					emitUp<Events.SET>(emitters, {
						event: Events.SET,
						path: newPath,
						value,
					});
				}

				return true;
			},
			deleteProperty(_target, key) {
				const newPath = [...path, key];

				const deepNestOptions = getDeepNestOptions(
					target,
					{
						...options,
					},
					pathStringMaker(newPath)
				);
				if (
					Reflect.deleteProperty(
						// @ts-ignore This is literally how it's meant to be used but ok.
						...arguments
					) &&
					deepNestOptions.loud
				) {
					emitUp(emitters, {
						event: Events.DELETE,
						path: newPath,
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
