export default function deepClone<Type>(obj: Type): Type {
	// Use the new standard if it exists.
	if (globalThis.structuredClone) return globalThis.structuredClone(obj);
	// Otherwise use the old method.
	if (typeof obj !== "object") return obj;
	const clone = (Array.isArray(obj) ? [] : {}) as Type;
	for (const key in obj) {
		clone[key] = deepClone(obj[key]);
	}
	return clone;
}
