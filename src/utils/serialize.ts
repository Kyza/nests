import set from "./set";
import walkTree from "./walkTree";

export default function serialize(
	object: object,
	intercept?: (node: any) => boolean | void
): any {
	const result = Array.isArray(object) ? [] : {};
	walkTree(object, (value, path) => {
		if (intercept) {
			const interceptResult = intercept(value);
			if (typeof interceptResult === "object") {
				set(result, path, interceptResult);
				return;
			}
		}

		if (path[path.length - 1] === "$$SERIALIZED_TYPE$$") {
			set(result, path, value);
			return false;
		}
		if (value instanceof RegExp) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "RegExp",
					value: value.toString(),
					color: "rgb(53, 212, 199)",
				},
			});
			return;
		}
		if (value instanceof Date) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Date",
					value: value.toISOString(),
					color: "rgb(53, 212, 199)",
				},
			});
			return;
		}
		if (value instanceof Map) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: `Map(${value.size})`,
					value: serialize(Object.fromEntries(value.entries())),
					color: "rgb(154, 160, 166)",
				},
			});
			return;
		}
		if (value instanceof Set) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: `Set(${value.size})`,
					value: serialize([...value]),
					color: "rgb(154, 160, 166)",
				},
			});
			return;
		}
		if (value instanceof Function) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Function",
					value: value.toString(),
					color: "hsl(252deg 100% 75%)",
				},
			});
			return;
		}
		if (typeof value === "bigint" || value instanceof BigInt) {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "BigInt",
					value: `${value.toString()}n`,
					color: "hsl(252deg 100% 75%)",
				},
			});
			return;
		}
		if (typeof value === "symbol") {
			set(result, path, {
				$$SERIALIZED_TYPE$$: {
					type: "Symbol",
					value: value.toString(),
					color: "rgb(53, 212, 199)",
				},
			});
			return;
		}
		if (path.length > 0) set(result, path, value);
	});
	return result;
}
