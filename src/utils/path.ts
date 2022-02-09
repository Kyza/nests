import Nest from "../Nest";
import { pathSymbol } from "../symbols";

export default function path<Data extends object>(
	nest: Nest<Data>
): (string | symbol)[] {
	return nest[pathSymbol];
}
