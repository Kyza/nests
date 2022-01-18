import Events from "../Events";
import { offSymbol, ListenerFunction } from "../lib-utils/makeEmitter";
import on from "./on";

export default function once<Data>(
	events: Events | Events[],
	obj: Data | [Data, string | symbol],
	func: ListenerFunction<Data>
) {
	let off;
	func[offSymbol] = () => {
		off?.();
	};
	return (off = on(events, obj, func));
}
