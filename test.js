const { Nest, NestEvents } = require("./dev");

const { nest, emitter } = Nest({
	fastArrays: false,
});

emitter.on(NestEvents.SET, (data) => {
	console.log(data);
});

// Emits!
nest.array = [1];

// Doesn't emit.
nest.array.push(1);

// Doesn't emit.
nest.array[1] = 2;

// Emits!
nest.array = nest.array;

// if (!("key" in nest.some.new)) {
// 	console.log("Doesn't have it!");
// }

// function nanoseconds() {
// 	const hrTime = process.hrtime();
// 	return hrTime[0] * 1000000000 + hrTime[1];
// }

// const template = new Array(10000).fill(Math.random());

// const start2 = nanoseconds();
// const array = template;
// array.unshift(Math.random());
// const time2 = nanoseconds() - start2;

// console.log(`Normal Array Speed: ${time2.toLocaleString()}ns`);

// const start1 = nanoseconds();
// nest.array = template;
// nest.array.unshift(Math.random());
// const time1 = nanoseconds() - start1;

// console.log(`Nest Array Speed: ${time1.toLocaleString()}ns`);

// nest.cool = Math.random();

// console.log(nest.cool);
