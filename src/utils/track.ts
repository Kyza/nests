import {
	ApplyListenerData,
	BulkListenerData,
	DeleteListenerData,
	ListenerFunction,
	SetListenerData,
} from "../EventEmitter";
import Events from "../Events";
import Nest from "../Nest";

export default function track<Data>(name: string, nest: Nest<Data>) {
	function listener() {
		console.log(name, "listener");

		window.postMessage(
			{ type: "nests-devtools-update", nest: nest.state },
			"*"
		);
	}

	nest.on(Events.APPLY, listener);
	nest.on(Events.BULK, listener);
	nest.on(Events.DELETE, listener);
	nest.on(Events.SET, listener);
	nest.on(Events.UPDATE, listener);
	return function untrack() {
		nest.off(Events.APPLY, listener);
		nest.off(Events.BULK, listener);
		nest.off(Events.DELETE, listener);
		nest.off(Events.SET, listener);
		nest.off(Events.UPDATE, listener);
	};
}
