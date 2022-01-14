import {
	shallowSymbol,
	originalSymbol,
	loudSymbol,
	deepSymbol,
	silentSymbol,
} from "./symbols";

export function original<Data>(nest: Data): Data {
	return nest[originalSymbol];
}

export function shallow<Data extends object>(obj: Data): Data {
	return obj[shallowSymbol];
}
export function deep<Data extends object>(obj: Data): Data {
	return obj[deepSymbol];
}

export function silent<Data extends object>(obj: Data): Data {
	return obj[silentSymbol];
}
export function loud<Data extends object>(obj: Data): Data {
	return obj[loudSymbol];
}

export function set<Data extends object>(nest: object, value: Data): Data {
	// TODO: Make this a bulk that uses it on everything so it gets emitted.
	// Possibly diff the changes and emit those as bulk instead of using bulk directly.

	const nestKeys = Object.keys(nest);
	for (let i = 0; i < nestKeys.length; i++) {
		const key = nestKeys[i];
		if (key in value) {
			original(nest)[key] = value[key];
		} else {
			delete original(nest)[key];
		}
	}

	return nest as Data;
}
