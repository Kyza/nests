// Typings are broken for deep-proxy, for now we call this @ts-ignore.
// This module is being annoying. It'll be written from scratch in the future.
import * as DP from "proxy-deep";
// For now this fixes problems with some bundlers.
const DeepProxy = DP.hasOwnProperty("default") ? DP.default : DP;

import EventEmitter from "../EventEmitter";
import NestEvents from "../NestEvents";
import get from "../utilities/get";
import set from "../utilities/set";
import del from "../utilities/del";
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
				const path = [...this.path, thisArg];
				const value = get(data, path, {});
				if (Nest.has(value)) {
					emitter.emit(NestEvents.GET, {
						nest: this.rootTarget,
						path,
						value,
					});
					if (!fastArrays && Array.isArray(value)) return this.nest(value);
					return value;
				}
				return this.nest(value);
			},
			// @ts-ignore
			set(target, thisArg, value, receiver) {
				const path = [...this.path, thisArg];
				set(data, path, value);
				emitter.emit(NestEvents.SET, {
					nest: this.rootTarget,
					path,
					value,
				});
				// This needs to return true or it errors. /shrug
				return true;
			},
			// @ts-ignore
			deleteProperty(target, thisArg) {
				const path = [...this.path, thisArg];
				if (del(data, path)) {
					emitter.emit(NestEvents.DEL, {
						nest: this.rootTarget,
						path,
					});
					return true;
				}
				return false;
			},
		}),
		emitter,
	};
}

Nest.has = has;
