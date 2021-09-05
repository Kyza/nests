const { Nest, NestEvents } = require("./dev");

const { nest, emitter } = Nest({
	fastArrays: true,
});

emitter.on(NestEvents.AFTER_SET, (data) => {
	console.log(data);
});

// Emits!
nest.array = [];

// Doesn't emit.
nest.array.push(1);

// Doesn't emit.
nest.array[1] = 2;

// Emits!
nest.array = nest.array;

// Returns true for everything but {}.
if (!Nest.has(nest.some.new.key)) {
	console.log("Doesn't have it!");
}

console.log(Nest.has({}), Nest.has(new Date()));

// function nanoseconds() {
// 	const hrTime = process.hrtime();
// 	return hrTime[0] * 1000000000 + hrTime[1];
// }

// const start2 = nanoseconds();
// const array = new Array(1000000).fill(Math.random());
// array.unshift(Math.random());
// const time2 = nanoseconds() - start2;

// console.log(`Normal Array Speed: ${time2.toLocaleString()}ns`);

// const start1 = nanoseconds();
// nest.array = new Array(1000000).fill(Math.random());
// nest.array.unshift(Math.random());
// const time1 = nanoseconds() - start1;

// console.log(`Nest Array Speed: ${time1.toLocaleString()}ns`);

// nest.cool = Math.random();

// console.log(nest.cool);
