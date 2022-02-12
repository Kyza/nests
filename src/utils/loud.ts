import Nest from "../Nest";
import { loudSymbol, silentSymbol } from "../symbols";
import isNest from "./isNest";

export default function loud<Data extends object>(
	obj: Nest<Data> | Data
): Nest<Data> | Data {
	return isNest(obj)
		? (obj[loudSymbol] as Nest<Data>)
		: ((obj[silentSymbol] = false), obj as Data);
}
