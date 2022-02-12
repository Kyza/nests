import Nest from "../Nest";
import path from "../utils/path";
import pathStringMaker from "./pathStringMaker";

export default function getDifferences(
	oldNest: Nest<any>,
	newNest: Nest<any>,
	keyPath?: string
): Set<string> {
	const differences = new Set<string>();
	// If they're different types, they're different. Duh.
	if (typeof oldNest !== typeof newNest) {
		return differences.add(keyPath);
	}
	// If they're both objects or arrays, compare their keys.
	if (
		(newNest.constructor === Object && oldNest.constructor === Object) ||
		(Array.isArray(newNest) && Array.isArray(oldNest))
	) {
		const keys = new Set<string | number | symbol>([
			...Reflect.ownKeys(oldNest),
			...Reflect.ownKeys(newNest),
		]);
		for (const key of keys) {
			const keyPath = pathStringMaker([...path(oldNest), key]);
			const oldValue = oldNest[key];
			const newValue = newNest[key];
			for (const difference of getDifferences(oldValue, newValue, keyPath)) {
				differences.add(difference);
			}
		}
		return differences;
	}
	// They're both primitives or classes, compare them.
	return oldNest !== newNest ? differences.add(keyPath) : differences;
}
