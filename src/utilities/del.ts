export default function del(obj: any, path: string | PropertyKey[]) {
	const keys: PropertyKey[] = typeof path === "string" ? path.split(".") : path;
	for (let i = 0; i < keys.length - 1; i++) {
		obj = obj[keys[i]];
		if (obj === null || obj === undefined) {
			return false;
		}
	}
	return delete obj[keys[keys.length - 1]];
}
