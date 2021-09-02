export default class EventEmitter {
	#listeners: any = {};

	on({
		event,
		id,
		listener,
	}: {
		event: string;
		id: string;
		listener: () => void;
	}) {
		if (this.#listeners[event]?.[id]) {
			throw Error(`Listener "${id}" on ${event} already exists.`);
		}
		if (!this.#listeners[event]) {
			this.#listeners[event] = {};
		}
		this.#listeners[event][id] = listener;
	}

	off({ event, id }: { event: string; id: string; listener: () => void }) {
		if (!this.#listeners[event]?.[id]) {
			return;
		}

		delete this.#listeners[event][id];
	}

	emit({ event, data }: { event: string; data: any[] }) {
		if (!this.#listeners[event]) {
			return;
		}

		for (const listener of this.#listeners[event]) {
			listener(...data);
		}
	}
}
