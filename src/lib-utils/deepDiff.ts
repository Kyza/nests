import path from "../utils/path";
import pathStringMaker from "./pathStringMaker";

export default function deepDiff(oldNest: object, newNest: object) {
	const deleted = new Set<string>();
	const added = new Set<string>();
	const changed = new Set<string>();

	const keys = new Set<string | symbol>([
		...Reflect.ownKeys(oldNest),
		...Reflect.ownKeys(newNest),
	]);
	for (const key of keys) {
		const oldValue = oldNest[key];
		const newValue = newNest[key];

		if (newValue === undefined) {
			deleted.add(pathStringMaker([...path(oldNest), key]));
		}

		const newPath = pathStringMaker([...path(oldNest), key]);

		if (oldValue === undefined) {
			added.add(newPath);
		} else {
			if (oldValue !== newValue) {
				changed.add(newPath);
			}
		}
	}

	return {
		deleted: [...deleted],
		added: [...added],
		changed: [...changed],
		all: [...new Set([...deleted, ...added, ...changed])],
	};
}
