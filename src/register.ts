import { v4 as uuid } from "uuid";
import type { StoreOptions } from "./stores";
import stores from "./stores";
import serialize from "./utils/serialize";

export type RegisterOptions =
	| (StoreOptions & {
			state: any;
	  })
	| {
			type: "COMPONENT";
			id?: string;
			component: any;
			stores: string[];
			serialize?: boolean;
			trace?: boolean;
	  };

export default function register(options: RegisterOptions): string {
	// Don't check for duplicate IDs. That's handled by the extension.
	// If there is an identical ID it should be overwritten.
	// This is to smoothly handle HMR.
	options.id ??= uuid();
	options.serialize ??= true;

	console.log(`Registering store with id "${options.id}".`, options);

	if (options.type === "STORE") {
		stores[options.id] = options;

		if (options.serialize) {
			options.state = serialize(
				options.state,
				typeof options.serialize === "function" ? options.serialize : undefined
			);
		}

		window.postMessage(
			{
				...options,
				type: "REGISTER_STORE",
				source: "nests-devtools-extension",
			},
			"*"
		);
	}
	return options.id;
}
