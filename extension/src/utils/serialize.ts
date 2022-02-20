import set from "./set";
import walkTree from "./walkTree";

export default function serialize(object: object): any {
	const result = Array.isArray(object) ? [] : {};
	walkTree(object, (value, path) => {
		if (value instanceof RegExp) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "RegExp",
					value: value.toString(),
				},
			});
			return;
		}
		if (value instanceof Date) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Date",
					value: value.toISOString(),
				},
			});
			return;
		}
		if (value instanceof Map) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Map",
					value: serialize(Object.fromEntries(value.entries())),
				},
			});
			return;
		}
		if (value instanceof Set) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Set",
					value: serialize([...value]),
				},
			});
			return;
		}
		if (value instanceof Function) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "RegExp",
					value: value.toString(),
				},
			});
			return;
		}
		if (path.length > 0) set(result, path, value);
	});
	return result;
}
