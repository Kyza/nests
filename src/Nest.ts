import EventEmitter from "./EventEmitter";
import NestEvents from "./NestEvents";

export default function Nest({
	data = {},
	fastArrays = false,
}: {
	data?: object;
	fastArrays?: boolean;
} = {}): {
	nest: typeof Proxy;
	emitter: EventEmitter;
} {
	const emitter = new EventEmitter();
	function createProxy(
		target: any,
		root: any,
		path: string[] = []
	): typeof Proxy {
		return new Proxy(target, {
			get(target, property: string, receiver) {
				const newPath: string[] = [...path, property];
				const value = target[property];
				if (value !== undefined && value !== null) {
					emitter.emit(NestEvents.GET, {
						nest: root,
						path: newPath,
						value,
					});
					if (!fastArrays && Array.isArray(value)) {
						return createProxy(value, root, newPath);
					}
					if (typeof value === "object") {
						return createProxy(value, root, newPath);
					}
					return value;
				}
				return createProxy((target[property] = {}), root, newPath);
			},
			set(target, property: string, value, receiver) {
				target[property] = value;
				emitter.emit(NestEvents.SET, {
					nest: root,
					path: [...path, property],
					value,
				});
				// This needs to return true or it errors. /shrug
				return true;
			},
			deleteProperty(target, property: string) {
				if (delete target[property]) {
					emitter.emit(NestEvents.DEL, {
						nest: root,
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
		nest: createProxy(data, data),
		emitter,
	};
}
