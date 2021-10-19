import * as nests from "./src";
import v8 from "v8";

// type Structure = {
// 	array: number[];
// };

const nest = nests.make<any>(
	{ array: [] },
	{
		nestArrays: false,
		clone: (obj) => v8.deserialize(v8.serialize(obj)),
	}
);

nest.state = { array: [1, 2, 3] };

nest.ghost.cool.cool.cool = "yes";

console.log(nest.store);

// nest.on(nests.Events.BULK, (event) => {
// 	console.log(`BULK`);
// });

// nest.bulk((nest) => {
// 	nest.ghost.cool.thing;
// });
// nest.ghoul.array.push(-1);

// console.log(nest.ghoul);

// nest.store.array = [1, 2, 3];
// nest.store.array.push(4);

// // Emits!
// nest.array = [1];

// // Doesn't emit.
// nest.array.push(1);

// // Doesn't emit.
// nest.array[1] = 2;

// // Emits!
// nest.array = nest.array;

// nest.some.new.key;

// if (!("key" in nest.some.new)) {
// 	console.log("Doesn't have it!");
// }

// emitter.off(NestEvents.SET, listener);

// nest.on(nests.Events.BULK, (event, eventStack) => {
// 	console.log(`${event} = ${eventStack.length}`);
// });

// nest.bulk((nest) => {
// 	nest.store.name = "This adds something to the eventStack.";
// 	nest.ghost.name = "This does not.";
// });
// console.log(nest.store);

// function nanoseconds() {
// 	const hrTime = process.hrtime();
// 	return hrTime[0] * 1000000000 + hrTime[1];
// }

// const template = new Array(1000).fill(Math.random());

// // Don't be me and forget to warm up the engine.
// const array0 = [...template];
// array0.unshift(Math.random());

// // Now start benchmarking.
// const start2 = nanoseconds();
// const array = [...template];
// array.unshift(Math.random());
// const time2 = nanoseconds() - start2;

// console.log(`Normal Array Speed: ${time2.toLocaleString()}ns`);

// const start1 = nanoseconds();
// nest.store.array = [...template];
// nest.store.array.unshift(Math.random());
// const time1 = nanoseconds() - start1;

// console.log(`Store Array Speed: ${time1.toLocaleString()}ns`);

// const start3 = nanoseconds();
// nest.state.array = [...template];
// nest.state.array.unshift(Math.random());
// const time3 = nanoseconds() - start3;

// console.log(`State Array Speed: ${time3.toLocaleString()}ns`);

// const start4 = nanoseconds();
// nest.ghost.array = [...template];
// nest.ghost.array.unshift(Math.random());
// const time4 = nanoseconds() - start4;

// console.log(`Ghost Array Speed: ${time4.toLocaleString()}ns`);

// nest.state.array = [];

// const start5 = nanoseconds();
// nest.bulk((nest) => {
// 	nest.state.array = [...template];
// 	nest.state.array.unshift(Math.random());
// });
// const time5 = nanoseconds() - start5;

// console.log(`Bulk Array Speed: ${time5.toLocaleString()}ns`);

// console.log(nest.store.fast.length);
