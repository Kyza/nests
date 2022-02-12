import Nest from "../Nest";
import { deepSymbol } from "../symbols";

export default function deep<Data extends object>(
	nest: Nest<Data>
): Nest<Data> {
	return nest[deepSymbol];
}
