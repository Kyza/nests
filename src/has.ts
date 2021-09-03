export default function has(obj: any, path: string | PropertyKey[]) {
	const keys: PropertyKey[] = [
		...(typeof path === "string" ? path.split(".") : path),
	];

	for (const key of keys) {
		if (!(obj[key] ?? false)) {
			return false;
		}
		obj = obj[key];
	}
	return true;
}
