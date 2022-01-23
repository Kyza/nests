import { targetSymbol } from "../symbols";

export default function isNest(obj: object): boolean {
	return typeof obj === "object" && targetSymbol in obj;
}
