import { silentSymbol } from "../symbols";

export default function silent<Data extends object>(obj: Data): Data {
	return obj[silentSymbol];
}
