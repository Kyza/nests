import { pathSymbol } from "../symbols";

export default function path(nest: object) {
	return nest[pathSymbol];
}
