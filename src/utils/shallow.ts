import Nest from "../Nest";
import { deepSymbol, shallowSymbol } from "../symbols";
import isNest from "./isNest";

export default function shallow<Data extends object>(
	obj: Nest<Data> | Data
): Nest<Data> | Data {
	return isNest(obj)
		? (obj[shallowSymbol] as Nest<Data>)
		: ((obj[deepSymbol] = false), obj as Data);
}
