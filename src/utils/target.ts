import { targetSymbol } from "../symbols";

export default function target<Data>(nest: Data): Data {
	return nest[targetSymbol];
}
