import { make, Events } from "./src";
import { SetListenerData } from "./src/lib-utils/makeEmitter";
import type Nest from "./src/Nest";
import {
	on,
	once,
	off,
	silent,
	shallow,
	deep,
	isNest,
	target,
	loud,
} from "./src/utils";

// const gt = make({
// 	count: 1,
// 	get doubleCount() {
// 		return this.count * 2;
// 	},
// 	set doubleCount(value: number) {
// 		this.count = value / 2;
// 	},
// });

// console.log(gt.count, gt.doubleCount);

// on(Events.SET, gt, (data) => {
// 	console.log(data);
// });

// gt.doubleCount = 4;

// console.log(gt.count, gt.doubleCount);

// process.exit();

// A debounce function.
function debounce(func: Function, wait: number, immediate: boolean = false) {
	let timeout: NodeJS.Timeout | null;
	return function (this: any) {
		const context = this;
		const args = arguments;
		const later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

const largeArray = new Array(1000000).fill(0);

// Time how long it takes to unshift into the array in milliseconds using hrtime.

const nest = make<any>({
	array: target(largeArray),
});

on(Events.SET, nest, (data) => {
	console.log(data);
});

const t2 = process.hrtime();
largeArray.unshift(0);
const t3 = process.hrtime(t2);
console.log(`Unshift took ${t3[0] * 1000 + t3[1] / 1000000}ms.`);

const t0 = process.hrtime();
nest.array.unshift(0);
const t1 = process.hrtime(t0);
console.log(`Unshift took ${t1[0] * 1000 + t1[1] / 1000000}ms.`);

// console.log(nest, isNest(nest), isNest({}));

// once(Events.SET, nest, (data) => {
// 	console.log("all", data);
// });
// on(Events.SET, [nest, "cool"], (data) => {
// 	console.log("cool", data);
// });

// nest.cool = false;
// silent(nest).cool = true;
// try {
// 	shallow(nest).deep.in.nest = true;
// } catch {
// 	console.log("Dies, good.");
// }
// deep(shallow(nest)).deep.in.nest = true;

// console.log(nest);
