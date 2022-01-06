import * as utils from "./utils/index.js";

import on from "./on.js";
import shallow from "./shallow.js";
import target from "./target.js";
import set from "./set.js";

export type { default as Nest } from "./Nest.js";

export { default as Events } from "./Events.js";
export { default as make } from "./make.js";

export { utils, on, shallow, target as original, set };
