import Nest from "../Nest";
import { pathSymbol } from "../symbols";

export default function path<Data extends object>(
	nest: Nest<Data>
): (string | number | symbol)[] {
	return nest[pathSymbol];
}
