import Nest from "../Nest";
import { shallowSymbol } from "../symbols";

export default function shallow<Data extends object>(
	nest: Nest<Data>
): Nest<Data> {
	return nest[shallowSymbol];
}
