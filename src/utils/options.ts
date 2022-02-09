import { NestOptions } from "../make";
import Nest from "../Nest";
import { optionsSymbol } from "../symbols";

export default function options<Data extends object>(
	nest: Nest<Data>
): NestOptions {
	return nest[optionsSymbol];
}
