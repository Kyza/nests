export default function del(obj: any, path: string | PropertyKey[]) {
	const keys: PropertyKey[] = typeof path === "string" ? path.split(".") : path;
	for (let i = 0; i < keys.length - 1; i++) {
		if (obj === null || obj === undefined) {
			return false;
		}
		obj = obj[keys[i]];
	}
	return delete obj[keys[keys.length - 1]];
}
