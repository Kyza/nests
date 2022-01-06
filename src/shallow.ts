import { shallowSymbol } from "./symbols.js";

export default function shallow<Data extends object>(obj: Data): Data {
	return obj[shallowSymbol];
}
