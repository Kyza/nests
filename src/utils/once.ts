import Events from "../Events";
import { offSymbol, ListenerFunction } from "../lib-utils/makeEmitter";
import Nest from "../Nest";
import on from "./on";

export default function once<Data extends object>(
	events: Events | Events[],
	nest: Nest<Data> | [Nest<Data>, string | number | symbol],
	func: ListenerFunction<Nest<Data>>
) {
	let off;
	func[offSymbol] = () => {
		off?.();
	};
	return (off = on(events, nest, func));
}
