import options from "../utils/options";
import deepDiff from "./deepDiff";

export default function diff(
	nest: object | [object, string | symbol],
	path: (string | symbol)[],
	oldValue,
	newValue
): boolean {
	if (typeof nest === "object") {
		return deepDiff(oldValue, newValue).all.length === 0;
	}
	return options(nest).differ(path, oldValue, newValue);
}
