export default function set(obj: any, path: string | PropertyKey[], val: any) {
	const keys: PropertyKey[] = typeof path === "string" ? path.split(".") : path;
	for (let i = 0; i < keys.length - 1; i++) {
		obj = obj[keys[i]] ?? {};
	}
	return (obj[keys[keys.length - 1]] = val);
}
