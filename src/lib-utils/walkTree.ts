export default function walkTree<Data extends object>(
	nest: Data,
	callback: (node: any, path: (string | number | symbol)[]) => void
) {
	const walk = (value: any, path: (string | number | symbol)[]) => {
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				walk(value[i], [...path, i]);
			}
		} else if (typeof value === "object" && value !== null) {
			for (const key of Object.getOwnPropertySymbols(value)) {
				walk(value[key], [...path, key]);
			}
			for (const key of Object.keys(value)) {
				walk(value[key], [...path, key]);
			}
		}
		callback(value, [...path]);
	};
	walk(nest, []);
}
