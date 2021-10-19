"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const solid_js_1 = require("solid-js");
const Events_1 = __importDefault(require("../Events"));
function useNest(nest, transient = false, filter = () => true) {
    const signals = {};
    function listener(event, data) {
        var _a;
        if (filter(event, data)) {
            // Update the proper signal.
            (_a = signals[data.path.join(",")]) === null || _a === void 0 ? void 0 : _a.set(void 0);
        }
    }
    nest.on(Events_1.default.UPDATE, listener);
    if (!transient) {
        nest.on(Events_1.default.SET, listener);
        nest.on(Events_1.default.DELETE, listener);
    }
    (0, solid_js_1.onCleanup)(() => {
        nest.off(Events_1.default.UPDATE, listener);
        if (!transient) {
            nest.off(Events_1.default.SET, listener);
            nest.off(Events_1.default.DELETE, listener);
        }
    });
    function createProxy(target, root, path) {
        return new Proxy(target, {
            get(target, property) {
                const newPath = [...path, property];
                const newPathString = newPath.join(",");
                // If the signal doesn't exist, create it.
                if (!signals.hasOwnProperty(newPathString)) {
                    // Maybe try to get rid of { equals: false } eventually.
                    // The problem is UPDATE which is controlled by the user doesn't pass a data.value.
                    const [get, set] = (0, solid_js_1.createSignal)(target[property], { equals: false });
                    signals[newPathString] = { get, set };
                }
                // Call get on the signal.
                signals[newPathString].get();
                // If it's not an ending, deep proxy it more.
                // Otherwise return the value.
                const value = target[property];
                if (typeof value === "object") {
                    return createProxy(value, root, newPath);
                }
                return value;
            },
        });
    }
    // Wrap the ghost in a deep proxy to automatically call get on the signals for automatic updates that are compatible and smooth with Solid.
    return createProxy(nest.ghost, nest.ghost, []);
}
exports.default = useNest;
