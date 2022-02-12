import Nest from "../Nest";
import { silentSymbol } from "../symbols";

export default function silent<Data extends object>(
	nest: Nest<Data>
): Nest<Data> {
	return nest[silentSymbol];
}
