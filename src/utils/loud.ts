import Nest from "../Nest";
import { loudSymbol } from "../symbols";

export default function loud<Data extends object>(obj: Nest<Data>): Nest<Data> {
	return obj[loudSymbol];
}
