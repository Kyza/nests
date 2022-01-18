import { shallowSymbol } from "../symbols";

export default function shallow<Data extends object>(obj: Data): Data {
	return obj[shallowSymbol];
}
