import EventEmitter from "./EventEmitter";
import Nest from "./Nest";

export default function make<Data>(
	// This can be safely ignored, the Data will always be an object or it won't work anyway.
	// @ts-ignore
	data: Data = {},
	{
		nestArrays = true,
	}: {
		nestArrays?: boolean;
	} = {}
): Nest<Data> {
	const emitter = new EventEmitter();
	function createProxy(target: any, root: any, path: string[]): any {
		return new Proxy(target, {
			get(target, property: string) {
				const newPath: string[] = [...path, property];
				const value = target[property];
				if (value !== undefined && value !== null) {
					emitter.get({
						path: newPath,
						value,
					});
					if (!nestArrays && Array.isArray(value)) {
						return value;
					}
					if (typeof value === "object") {
						return createProxy(value, root, newPath);
					}
					return value;
				}
				return createProxy((target[property] = {}), root, newPath);
			},
			set(target, property: string, value) {
				target[property] = value;
				emitter.set({
					path: [...path, property],
					value,
				});
				// This needs to return true or it errors. /shrug
				return true;
			},
			deleteProperty(target, property: string) {
				if (delete target[property]) {
					emitter.delete({
						path: [...path, property],
					});
					return true;
				}
				return false;
			},
			has(target, property) {
				if (
					typeof target[property] === "object" &&
					Object.keys(target[property]).length === 0
				) {
					return false;
				}
				return property in target;
			},
		});
	}
	return {
		store: createProxy(data, data, []),
		// This can be safely ignored, the Data will always be an object or it won't work anyway.
		// @ts-ignore
		ghost: data,
		...emitter,
	};
}
