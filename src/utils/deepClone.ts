// TODO: This type handling sucks. Oh well!
export default function deepClone<Type extends object>(
	obj: Type,
	override: (obj: Type) => Type | undefined = () => void 0
): Type {
	if (override) {
		const clone = override(obj);
		if (clone != null) {
			return clone;
		}
	}

	// Nullish should be a leaf.
	if (obj == null) return obj;

	// Handle basic objects.
	if (obj.constructor === Object) {
		const cloneObj = {} as Type;
		for (const key in obj) {
			(cloneObj as any)[key] = deepClone<object>((obj as any)[key], override);
		}
		return cloneObj as Type;
	}

	// Handle classes.
	switch (obj.constructor) {
		case Date:
			return new Date((obj as Date).getTime()) as Type;
		case RegExp:
			return new RegExp((obj as RegExp).source, (obj as RegExp).flags) as Type;
		case Set:
			const cloneSet = new Set();
			for (const item of obj as Set<any>) {
				cloneSet.add(deepClone(item, override));
			}
			return cloneSet as Type;
		case Map:
			const cloneMap = new Map();
			for (const [key, value] of obj as Map<any, any>) {
				cloneMap.set(deepClone(key, override), deepClone(value, override));
			}
			return cloneMap as Type;
		case Array:
			let cloneArray = [];
			for (let i = 0; i < (obj as []).length; i++) {
				cloneArray.push(deepClone(obj[i], override));
			}
			return cloneArray as Type;
		default:
			// There's no telling how to clone a class correctly.
			// It's NEVER a good idea to randomly call the constructor.
			// It could contain private properties.
			// It could even be a primitive type.
			// Returning as a leaf as the safest option.
			return obj;
	}
}
