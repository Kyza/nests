export default function set<Type>(obj: Type, path: string[], value: any): Type {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (current[path[i]] == null) current[path[i]] = {};
		current = current[path[i]];
	}
	current[path[path.length - 1]] = value;
	return obj;
}
