export default function get<Type>(obj: Type, path: PropertyKey[]): Type {
	let current = obj;
	for (let i = 0; i < path.length; i++) {
		if (current[path[i]] == null) return undefined;
		current = current[path[i]];
	}
	return current;
}
