import { isNest } from ".";
import Nest from "../Nest";
import { silentSymbol } from "../symbols";

export default function silent<Data extends object>(
	obj: Nest<Data> | Data
): Nest<Data> | Data {
	return isNest(obj)
		? (obj[silentSymbol] as Nest<Data>)
		: ((obj[silentSymbol] = true), obj as Data);
}
