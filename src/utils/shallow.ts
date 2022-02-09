import Nest from "../Nest";
import { shallowSymbol } from "../symbols";

export default function shallow<Data extends object>(
	obj: Nest<Data>
): Nest<Data> {
	return obj[shallowSymbol];
}
