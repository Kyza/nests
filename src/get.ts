export default function get(
	obj: any,
	path: string | PropertyKey[],
	defaultVal: any
) {
	const keys: PropertyKey[] =
		typeof path === "string" ? path.split(".") : [...path];
	const lastKey: PropertyKey | undefined = keys.pop();

	if (lastKey !== undefined) {
		const lastObj: any = keys.reduce(
			(obj, key) => (obj[key] = obj[key] ?? {}),
			obj
		);
		return lastObj[lastKey] ?? defaultVal;
	}
	return defaultVal;
}
