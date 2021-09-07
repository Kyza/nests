import EventEmitter from "./EventEmitter";
import NestEvents from "./NestEvents";
import get from "./utilities/get";
import set from "./utilities/set";
import del from "./utilities/del";

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
			get(target, thisArg: string, receiver) {
				const newPath: string[] = [...path, thisArg];
				const { value, had } = get(data, newPath, {});
				if (had) {
					emitter.emit(NestEvents.GET, {
						nest: root,
						path: newPath,
						value,
					});
					if (!fastArrays && Array.isArray(value)) {
						return createProxy(value, root, newPath);
					}
					return value;
				}
				return createProxy(value, root, newPath);
			},
			set(target, thisArg: string, value, receiver) {
				const newPath: string[] = [...path, thisArg];
				set(data, newPath, value);
				emitter.emit(NestEvents.SET, {
					nest: root,
					path: newPath,
					value,
				});
				// This needs to return true or it errors. /shrug
				return true;
			},
			deleteProperty(target, thisArg: string) {
				const newPath: string[] = [...path, thisArg];
				if (del(data, newPath)) {
					emitter.emit(NestEvents.DEL, {
						nest: root,
						path: newPath,
					});
					return true;
				}
				return false;
			},
		});
	}

	return {
		nest: createProxy(data, data),
		emitter,
	};
}
