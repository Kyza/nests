export default function set<Type>(
	obj: Type,
	path: PropertyKey[],
	value: any
): Type {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (current[path[i]] == null) current[path[i]] = {};
		current = current[path[i]];
	}
	// Reflect.set(current as any, path[path.length - 1], value, receiver);
	current[path[path.length - 1]] = value;
	return obj;
}
