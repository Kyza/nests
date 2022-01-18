export default function set<Data extends object>(
	nest: Data,
	value: Data
): Data {
	// TODO: Make this a bulk that uses it on everything so it gets emitted.
	// Possibly diff the changes and emit those as bulk instead of using bulk directly.

	const nestKeys = Object.keys(nest);
	for (let i = 0; i < nestKeys.length; i++) {
		const key = nestKeys[i];
		if (key in value) {
			nest[key] = value[key];
		} else {
			delete nest[key];
		}
	}

	return nest;
}
