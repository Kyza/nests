export default function set(obj: any, path: string | PropertyKey[], val: any) {
	const keys: PropertyKey[] = [
		...(typeof path === "string" ? path.split(".") : path),
	];
	const lastKey: PropertyKey | undefined = keys.pop();

	if (lastKey !== undefined) {
		const lastObj: any = keys.reduce(
			(obj, key) => (obj[key] = obj[key] ?? {}),
			obj
		);
		return (lastObj[lastKey] = val);
	}
	return undefined;
}
