import Nest from "../Nest";
import { clonerSymbol } from "../symbols";
import target from "./target";

export default function copy<Data extends object>(
	nest: Nest<Data>
): Nest<Data> {
	return nest[clonerSymbol](target(nest));
}
