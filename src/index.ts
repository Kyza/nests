import * as utils from "./utils/index";

import * as listeners from "./listeners";
import * as modifiers from "./modifiers";

import make from "./make.js";
import Events from "./Events.js";

export default {
	make,
	Events,
	utils,
	...listeners,
	...modifiers,
};
