import set from "./set";
import walkTree from "./walkTree";

export default function deserialize(object): any {
	const result = Array.isArray(object) ? [] : {};
	walkTree(object, (value, path) => {
		if (path[path.length - 1] === "$$SERIALIZED_TYPE$$") {
			const previousPath = path.slice(0, -1);
			const type = value.type;
			const realValue = value.value;
			switch (type) {
				// case "Function":
				// 	set(result, previousPath, new Function(realValue));
				// 	break;
				// case "RegExp":
				// 	set(result, previousPath, new RegExp(realValue[0], realValue[1]));
				// 	break;
				// case "Date":
				// 	set(result, previousPath, new Date(realValue));
				// 	break;
				// case "Set":
				// 	set(result, previousPath, new Set(deserialize(realValue)));
				// 	break;
				// case "Map":
				// 	set(result, previousPath, new Map(deserialize(realValue)));
				// 	break;
				default:
				// throw new Error(`Unknown serialized type: ${type}`);
			}
			return false;
		}
		if (path.length > 0) set(result, path, value);
	});
	return result;
}
