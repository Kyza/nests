// TODO: This type handling sucks. Oh well!
export default function deepClone<Type extends object>(
	obj: Type,
	override: (obj: Type) => Type | undefined = () => void 0
): Type {
	// This can be for adding support for things such as Maps, Sets, Dates, and more.
	if (override) {
		const clone = override(obj);
		if (clone != null) {
			return clone;
		}
	}

	// Nullish should be a leaf.
	if (obj == null) return obj;

	// Handle basic objects and arrays.
	const constructor = obj?.constructor;
	const isArray = Array.isArray(obj);
	const isFunction = typeof obj === "function";
	if (constructor === Object || isFunction || isArray) {
		const clone = isFunction ? obj : isArray ? new Array(obj.length) : {};
		const keys = Reflect.ownKeys(obj);
		for (let i = 0; i < keys.length; i++) {
			try {
				clone[keys[i]] = deepClone<object>(obj[keys[i]], override);
			} catch {
				// Assigned to a readonly property.
				// This should fail silently.
			}
		}
		return clone as Type;
	}
	return obj;
}
