import Nest from "./nest.js";
import fs, { promises as fsp } from "fs";
import zlib from "zlib";
import { promisify } from "util";

const promisifiedBrotliCompress = promisify(zlib.brotliCompress);
const promisifiedGzip = promisify(zlib.gzip);

function dbounce(func, time) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			timeout = null;
			func.apply(context, args);
		}, time);
	};
}

export default function FileSystemNest({
	location = "./storage",
	compression = false,
	load = true,
	debounce = 100,
} = {}) {
	const { store, emitter } = new Nest();

	let extension;
	switch (compression) {
		case "gzip":
			extension = ".gz";
			break;
		case "brotli":
			extension = ".br";
			break;
		case false:
		default:
			extension = ".json";
			break;
	}
	location += extension;

	if (load && fs.existsSync(location)) {
		try {
			let loaded = fs.readFileSync(location);
			switch (compression) {
				case "gzip":
					loaded = zlib.gunzipSync(loaded);
					break;
				case "brotli":
					loaded = zlib.brotliDecompressSync(loaded);
					break;
				case false:
				default:
					break;
			}
			loaded = JSON.parse(loaded);

			// Loop over all the keys of loaded and set them in store.
			for (const key in loaded) {
				store[key] = loaded[key];
			}
		} catch (e) {
			console.error(
				"Failed to load persistent storage. Possible corruption.",
				e
			);
		}
	}

	async function write() {
		let data = JSON.stringify(store);
		switch (compression) {
			case "gzip":
				data = await promisifiedGzip(data);
				break;
			case "brotli":
				data = await promisifiedBrotliCompress(data);
				break;
			case false:
			default:
				break;
		}

		fsp.writeFile(location, data);
	}
	write = dbounce(write, debounce);

	emitter.on("after-set", async () => {
		// TODO: Optimize for if the item is an array.
		await write();
	});

	return { store, emitter };
}
