export default function deepClone<Type>(obj: Type): Type {
	if (typeof obj !== "object") return obj;
	const clone = (Array.isArray(obj) ? [] : {}) as Type;
	for (const key in obj) {
		clone[key] = deepClone(obj[key]);
	}
	return clone;
}
