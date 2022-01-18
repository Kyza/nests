import { clonerSymbol } from "../symbols";
import target from "./target";

export default function copy<Data extends object>(nest: Data): Data {
	return nest[clonerSymbol](target(nest));
}
