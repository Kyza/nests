import { targetSymbol } from "../symbols";

export default function isNest(obj: any): boolean {
	return typeof obj === "object" && targetSymbol in obj;
}
