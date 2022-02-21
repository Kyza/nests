import stores from "./stores";
import serialize from "./utils/serialize";

export default function update(options: {
	id: string;
	name: string;
	state: any;
}) {
	let storeOptions = stores[options.id];
	if (storeOptions) {
		if (storeOptions.serialize) {
			options.state = serialize(
				options.state,
				typeof storeOptions.serialize === "function"
					? storeOptions.serialize
					: undefined
			);
		}

		window.postMessage(
			{
				...storeOptions,
				...options,
				type: "UPDATE_STORE",
				source: "nests-devtools-extension",
			},
			"*"
		);
	} else {
		throw new Error(`Store with id "${options.id}" not found.`);
	}
}
