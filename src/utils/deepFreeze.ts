export default function deepFreeze<Type extends object>(object: Type): Type {
	const keys = Object.keys(object);
	for (let i = 0; i < keys.length; i++) {
		let value = object[keys[i]];
		if (value !== null && typeof value === "object") {
			deepFreeze(value);
		}
	}
	return Object.freeze(object);
}
