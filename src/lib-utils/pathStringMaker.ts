import Nest from "../Nest";
import { pathSymbol } from "../symbols";
import symbolJoin from "./symbolJoin";

export default function pathStringMaker<Data extends object>(
	nest: Nest<Data> | [Nest<Data>, string | symbol] | (string | symbol)[]
) {
	let key: string | symbol | (string | symbol)[];
	if (Array.isArray(nest)) {
		if (typeof nest[0] === "object") {
			[nest, ...key] = nest as [Nest<Data>, string | symbol];
			key = symbolJoin(key as (string | symbol)[], ".");
		} else {
			return symbolJoin(nest as (string | symbol)[], ".");
		}
	}

	const pathArray = nest[pathSymbol];
	// I can't use .join because it fails on symbols because JavaScript.
	return (
		symbolJoin(pathArray, ".") +
		(key != null ? `${pathArray.length === 0 ? "" : "."}${key as string}` : "")
	);
}
