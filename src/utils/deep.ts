import { deepSymbol } from "../symbols";

export default function deep<Data extends object>(obj: Data): Data {
	return obj[deepSymbol];
}
