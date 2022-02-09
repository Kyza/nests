import Nest from "../Nest";
import { targetSymbol } from "../symbols";

export default function target<Data extends object>(
	nest: Nest<Data>
): Nest<Data> {
	return nest[targetSymbol];
}
