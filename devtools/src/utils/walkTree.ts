export default function walkTree(
	obj: object,
	callback: (node: any, path: PropertyKey[]) => boolean | void
) {
	const walk = (value: any, path: PropertyKey[]) => {
		const result = callback(value, [...path]);
		// Require explicit false return to stop walking.
		if (result === false) return;
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				walk(value[i], [...path, i]);
			}
		} else if (typeof value === "object" && value !== null) {
			for (const key of Reflect.ownKeys(value)) {
				walk(value[key], [...path, key]);
			}
		}
	};
	walk(obj, []);
}
