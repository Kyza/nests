const { Nest } = require("./lib");

const { store, emitter } = Nest({
	fastArrays: true,
});

function nanoseconds() {
	const hrTime = process.hrtime();
	return hrTime[0] * 1000000000 + hrTime[1];
}

const start2 = nanoseconds();
const array = new Array(1000000).fill(Math.random());
array.unshift(Math.random());
const time2 = nanoseconds() - start2;

console.log(`Normal Array Speed: ${time2.toLocaleString()}ns`);

const start1 = nanoseconds();
store.array = new Array(1000000).fill(Math.random());
store.array.unshift(Math.random());
const time1 = nanoseconds() - start1;

console.log(`Store Array Speed: ${time1.toLocaleString()}ns`);

store.cool = Math.random();

console.log(store.cool);
