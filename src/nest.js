import DeepProxy from "proxy-deep";
import EventEmitter from "events";

export default function Nest(defaultData) {
	const data = defaultData ?? {};
	const emitter = new EventEmitter();

	return {
		store: DeepProxy(data, {
			get(target, thisArg, receiver) {
				const fullPath = [...this.path, thisArg];

				emitter.emit("before-get", fullPath);
				const value = get(data, fullPath, {});
				if (typeof value !== "object") {
					emitter.emit("after-get", fullPath, value);
				}

				return typeof value === "object" ? this.nest(value) : value;
			},
			set(target, thisArg, value, receiver) {
				const fullPath = [...this.path, thisArg];

				emitter.emit("before-set", fullPath, value);
				set(data, fullPath, value);
				emitter.emit("after-set", fullPath, value);

				return true;
			},
			deleteProperty(target, thisArg) {
				const fullPath = [...this.path, thisArg];
				const oldValue = get(data, fullPath, {});

				if (has(data, fullPath)) {
					emitter.emit("before-del", fullPath, oldValue);
					del(data, fullPath);
					emitter.emit("after-del", fullPath, oldValue);
				}

				return true;
			},
		}),
		emitter,
	};
}

function get(obj, path, defaultVal) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];
	const lastKey = keys.pop();
	const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] ?? {}), obj);
	return lastObj[lastKey] ?? defaultVal;
}
function set(obj, path, val) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];
	const lastKey = keys.pop();
	const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] ?? {}), obj);
	return (lastObj[lastKey] = val);
}
function del(obj, path) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];
	const lastKey = keys.pop();

	for (const key of keys) {
		if (!(obj[key] ?? false)) {
			return false;
		}
		obj = obj[key];
	}
	delete obj[lastKey];
	return true;
}
function has(obj, path) {
	const keys = [...(typeof path === "string" ? path.split(".") : path)];

	for (const key of keys) {
		if (!(obj[key] ?? false)) {
			return false;
		}
		obj = obj[key];
	}
	return true;
}
