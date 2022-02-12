import Nest from "../Nest";
import { loudSymbol } from "../symbols";

export default function loud<Data extends object>(
	nest: Nest<Data>
): Nest<Data> {
	return nest[loudSymbol];
}
