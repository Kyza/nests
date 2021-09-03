export default function del(obj: any, path: string | PropertyKey[]) {
	const keys: PropertyKey[] = [
		...(typeof path === "string" ? path.split(".") : path),
	];
	const lastKey: PropertyKey | undefined = keys.pop();

	if (lastKey !== undefined) {
		for (const key of keys) {
			if (!(obj[key] ?? false)) {
				return false;
			}
			obj = obj[key];
		}
		return delete obj[lastKey];
	}
	return false;
}
