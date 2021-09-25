const nests = require("./dev");

const nest = nests.make();

nest.on(nests.Events.SET, (event, { path, value }) => {
	console.log(`set: ${path} = ${value}`);
});

nest.store.array = [1, 2, 3];
nest.store.array.push(4);
nest.store.instant.deeply.nested.state = true;

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

// function nanoseconds() {
// 	const hrTime = process.hrtime();
// 	return hrTime[0] * 1000000000 + hrTime[1];
// }

// const template = new Array(1000000).fill(Math.random());

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

// console.log(`Nest Array Speed: ${time1.toLocaleString()}ns`);

// const start3 = nanoseconds();
// nest.ghost.fast = [...template];
// nest.ghost.fast.unshift(Math.random());
// const time3 = nanoseconds() - start3;

// console.log(`Ghost Array Speed: ${time3.toLocaleString()}ns`);

// console.log(nest.store.fast.length);
