export default function get(
	obj: any,
	path: string | PropertyKey[],
	defaultVal: any
) {
	const keys: PropertyKey[] = typeof path === "string" ? path.split(".") : path;
	for (let i = 0; i < keys.length; i++) {
		obj = obj[keys[i]];
		if (obj === null || obj === undefined) {
			return { value: defaultVal, had: false };
		}
	}
	return { value: obj, had: true };
}
