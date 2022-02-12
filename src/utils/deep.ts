import Nest from "../Nest";
import { deepSymbol } from "../symbols";
import isNest from "./isNest";

export default function deep<Data extends object>(
	obj: Nest<Data> | Data
): Nest<Data> | Data {
	return isNest(obj)
		? (obj[deepSymbol] as Nest<Data>)
		: ((obj[deepSymbol] = true), obj as Data);
}
