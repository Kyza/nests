// Typings are broken for deep-proxy, for now we call this @ts-ignore.
// This module is being annoying. It'll be written from scratch in the future.
import * as DP from "proxy-deep";
// For now this fixes problems with some bundlers.
const DeepProxy = DP.hasOwnProperty("default") ? DP.default : DP;

import EventEmitter from "./EventEmitter";
import NestEvents from "./NestEvents";
import get from "./get";
import set from "./set";
import del from "./del";
import has from "./has";

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

	return {
		// @ts-ignore
		nest: new DeepProxy(data, {
			// @ts-ignore
			get(target, thisArg, receiver) {
				const fullPath = [...this.path, thisArg];

				emitter.emit(NestEvents.BEFORE_GET, {
					nest: this.rootTarget,
					fullPath,
				});
				const value = get(data, fullPath, {});
				if (typeof value !== "object") {
					emitter.emit(NestEvents.AFTER_GET, {
						nest: this.rootTarget,
						fullPath,
						value,
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

				emitter.emit(NestEvents.BEFORE_SET, {
					nest: this.rootTarget,
					fullPath,
					value,
				});
				set(data, fullPath, value);
				emitter.emit(NestEvents.AFTER_SET, {
					nest: this.rootTarget,
					fullPath,
					value,
				});

				return true;
			},
			// @ts-ignore
			deleteProperty(target, thisArg) {
				const fullPath = [...this.path, thisArg];
				const value = get(data, fullPath, {});

				if (has(data, fullPath)) {
					emitter.emit(NestEvents.BEFORE_DEL, {
						nest: this.rootTarget,
						fullPath,
						value,
					});
					del(data, fullPath);
					emitter.emit(NestEvents.AFTER_DEL, {
						nest: this.rootTarget,
						fullPath,
						value,
					});
				}

				return true;
			},
		}),
		emitter,
	};
}

Nest.has = function (nest: any): boolean {
	if (nest === null || nest === undefined) return false;
	if (nest.constructor === Object) return !!Object.keys(nest).length;
	return true;
};
