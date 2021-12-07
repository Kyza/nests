export default function get<Type>(obj: Type, path: (string | symbol)[]): any {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (current[path[i]] == null) return;
		current = current[path[i]];
	}
	return obj;
}
