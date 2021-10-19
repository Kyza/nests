"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import default from React or CRA fails.
// Why isn't CRA being updated to modern technologies if it's recommended officially.
const react_1 = require("react");
const Events_1 = __importDefault(require("../Events"));
function useNest(nest, transient = false, filter = () => true) {
    // Keep this here for React devtools.
    // @ts-ignore
    const value = (0, react_1.useRef)(nest.ghost);
    const [, forceUpdate] = (0, react_1.useReducer)((n) => ~n, 0);
    (0, react_1.useEffect)(() => {
        function listener(event, data) {
            if (filter(event, data))
                forceUpdate();
        }
        nest.on(Events_1.default.UPDATE, listener);
        if (!transient) {
            nest.on(Events_1.default.SET, listener);
            nest.on(Events_1.default.DELETE, listener);
        }
        return () => {
            nest.off(Events_1.default.UPDATE, listener);
            if (!transient) {
                nest.off(Events_1.default.SET, listener);
                nest.off(Events_1.default.DELETE, listener);
            }
        };
    }, []);
    return nest.ghost;
}
exports.default = useNest;
