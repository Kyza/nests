export default function isDifferent(oldObj: any, newObj: any): boolean {
	// If they're different types, they're different. Duh.
	if (typeof oldObj !== typeof newObj) {
		return true;
	}
	// Speedy array comparison.
	const areArrays = Array.isArray(oldObj) && Array.isArray(newObj);
	if (oldObj.length !== newObj.length) {
		return true;
	}
	// If they're both objects or arrays, compare their keys.
	if (
		(newObj.constructor === Object && oldObj.constructor === Object) ||
		areArrays
	) {
		const keys = new Set<string | symbol>([
			...Reflect.ownKeys(oldObj),
			...Reflect.ownKeys(newObj),
		]);
		for (const key of keys) {
			const oldValue = oldObj[key];
			const newValue = newObj[key];
			if (isDifferent(oldValue, newValue)) {
				return true;
			}
		}
		return false;
	}
	// They're both primitives or classes, compare them.
	return oldObj !== newObj;
}
