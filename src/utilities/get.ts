export default function get(
	obj: any,
	path: string | PropertyKey[],
	defaultVal: any
) {
	const keys: PropertyKey[] = typeof path === "string" ? path.split(".") : path;
	for (let i = 0; i < keys.length; i++) {
		if (obj === null || obj === undefined) {
			return defaultVal;
		}

		obj = obj[keys[i]];
	}
	return obj ?? defaultVal;
}
