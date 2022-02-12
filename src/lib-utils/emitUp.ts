import Events from "../Events";
import { EventEmitter, ListenerReceive } from "./makeEmitter";

export default function emitUp<EventType extends keyof typeof Events>(
	emitters: {
		[path: string]: EventEmitter;
	},
	data: ListenerReceive<EventType>
) {
	//
	// Emit to the base nest listeners.
	emitters[""]?.emit<keyof typeof Events>(data.event, data);
	// Emit up the chain.
	let emitterPaths = "";
	for (let i = 0; i < data.path.length; i++) {
		emitterPaths += (i === 0 ? "" : ".") + data.path[i].toString();
		emitters[emitterPaths]?.emit<keyof typeof Events>(data.event, data);
	}
}
