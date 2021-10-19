export default function get<Type>(obj: Type, path: string[]): any {
	return path.reduce((o, i) => o?.[i], obj);
}
