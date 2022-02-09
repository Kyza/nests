import Nest from "../Nest";
import { silentSymbol } from "../symbols";

export default function silent<Data extends object>(
	obj: Nest<Data>
): Nest<Data> {
	return obj[silentSymbol];
}
