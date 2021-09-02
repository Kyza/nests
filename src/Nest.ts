// Typings are broken maybe it's me maybe it isn't but for now we call this @ts-ignore.
import * as DeepProxy from "proxy-deep";

import EventEmitter from "./EventEmitter";
import { NestEvents } from "./index";

export default function Nest({
	data = {},
	fastArrays = false,
}: {
	data?: object;
	fastArrays?: boolean;
} = {}): {
	store: any;
	emitter: EventEmitter;
} {
	const emitter = new EventEmitter();

	return {
		// @ts-ignore
		store: new DeepProxy(data, {
			// @ts-ignore
			get(target, thisArg, receiver) {
				const fullPath = [...this.path, thisArg];

				emitter.emit({ event: NestEvents.BEFORE_GET, data: fullPath });
				const value = get(data, fullPath, {});
				if (typeof value !== "object") {
					emitter.emit({
						event: NestEvents.AFTER_GET,
						data: [fullPath, value],
					});
				}

				if (typeof value === "object") {
					if (fastArrays && Array.isArray(value)) return value;
					return this.nest(value);
				}
				return value;
			},
			// @ts-ignore
			set(target, thisArg, value, receiver) {
				const fullPath = [...this.path, thisArg];

				emitter.emit({ event: NestEvents.BEFORE_SET, data: [fullPath, value] });
				set(data, fullPath, value);
				emitter.emit({ event: NestEvents.AFTER_SET, data: [fullPath, value] });

				return true;
			},
			// @ts-ignore
			deleteProperty(target, thisArg) {
				const fullPath = [...this.path, thisArg];
				const oldValue = get(data, fullPath, {});

				if (has(data, fullPath)) {
					emitter.emit({
						event: NestEvents.BEFORE_DEL,
						data: [fullPath, oldValue],
					});
					del(data, fullPath);
					emitter.emit({
						event: NestEvents.AFTER_DEL,
						data: [fullPath, oldValue],
					});
				}

				return true;
			},
		}),
		emitter,
	};
}

function get(
	obj: any,
	path: string | string[] | PropertyKey[],
	defaultVal: any
) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];
	const lastKey = keys.pop() ?? "";
	const lastObj: any = keys.reduce(
		(obj, key) => (obj[key] = obj[key] ?? {}),
		obj
	);
	return lastObj[lastKey] ?? defaultVal;
}
function set(obj: any, path: string | string[] | PropertyKey[], val: any) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];
	const lastKey = keys.pop() ?? "";
	const lastObj: any = keys.reduce(
		(obj, key) => (obj[key] = obj[key] ?? {}),
		obj
	);
	return (lastObj[lastKey] = val);
}
function del(obj: any, path: string | string[] | PropertyKey[]) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];
	const lastKey = keys.pop() ?? "";

	for (const key of keys) {
		if (!(obj[key] ?? false)) {
			return false;
		}
		obj = obj[key];
	}
	delete obj[lastKey];
	return true;
}
function has(obj: any, path: string | string[] | PropertyKey[]) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];

	for (const key of keys) {
		if (!(obj[key] ?? false)) {
			return false;
		}
		obj = obj[key];
	}
	return true;
}
