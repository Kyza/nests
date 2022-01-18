import { optionsSymbol } from "../symbols";

export default function options<Data extends object>(nest: Data): any {
	return nest[optionsSymbol];
}
