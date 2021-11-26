import { NestOptions } from "../make";
import set from "./set";

export default function DeepNest<Data extends object>(
	target: any,
	root: any,
	path: string[],

	options: { deep?: boolean } & NestOptions = { deep: true },

	traps?: {
		get?: (target: any, key: string, path: string[], value: any) => void;
		set?: (target: any, key: string, path: string[], value: any) => void;
		has?: (target: any, key: string, path: string[]) => void;
		deleteProperty?: (target: any, key: string, path: string[]) => void;
		apply?: (
			target: any,
			key: string,
			path: string[],
			thisArg: any,
			args: any[],
			value: any
		) => void;
	}
): Data {
	// Set the defaults.
	options.deep ??= true;

	const nestTraps: ProxyHandler<Data> = {
		get(target, key: string) {
			const newPath: string[] = [...path, key];
			let value = target[key];

			const override = traps?.get?.(target, key, newPath, value);
			if (override != undefined) {
				return override;
			}

			if (value != null) {
				if (!options.nestArrays && Array.isArray(value)) {
					return value;
				}
				if (
					typeof value === "object" &&
					(options.nestClasses || value.constructor === Object)
				) {
					return DeepNest(value, root, newPath, options, traps);
				}
				return value;
			}
			if (options.deep) {
				return DeepNest({}, root, newPath, options, traps);
			}
			return value;
		},
		set(target, key: string, value) {
			const newPath = [...path, key];
			root = set(root, newPath, value);
			traps?.set?.(target, key, newPath, value);
			// This needs to return true or it errors. /shrug
			return true;
		},
		deleteProperty(target, key: string) {
			if (delete target[key]) {
				traps?.deleteProperty?.(target, key, [...path, key]);
				return true;
			}
			return false;
		},
		apply(target, thisArg, args) {
			const value = (target as Function).apply(thisArg, args);
			traps?.apply?.(
				target,
				path[path.length - 1],
				[...path],
				thisArg,
				args,
				value
			);
			return value;
		},
	};

	if (options.deep) {
		nestTraps.has = function (target, property) {
			if (
				typeof target[property] === "object" &&
				Object.keys(target[property]).length === 0
			) {
				return false;
			}
			return property in target;
		};
	}

	return new Proxy(target, nestTraps);
}
