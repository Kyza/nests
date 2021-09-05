export default function has(nest: any): boolean {
	if (nest === null || nest === undefined) return false;
	if (nest.constructor === Object) return !!Object.keys(nest).length;
	return true;
}
