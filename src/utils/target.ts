import Nest from "../Nest";
import { targetSymbol } from "../symbols";
import isNest from "./isNest";

export default function target<Data extends object>(
	obj: Nest<Data> | Data
): Nest<Data> | Data {
	return isNest(obj)
		? (obj[targetSymbol] as Nest<Data>)
		: ((obj[targetSymbol] = true), obj as Data);
}
