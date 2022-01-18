import { loudSymbol } from "../symbols";

export default function loud<Data extends object>(obj: Data): Data {
	return obj[loudSymbol];
}
