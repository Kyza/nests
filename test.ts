import { make, Events } from "./src";
import { on, once, off, silent, shallow, deep, isNest } from "./src/utils";

const gt = make({
	count: 0,
	get doubleCount() {
		return this.count * 2;
	},
	set doubleCount(value: number) {
		this.count = value / 2;
	},
});

console.log(gt.count, gt.doubleCount);

gt.doubleCount = 4;

console.log(gt.count, gt.doubleCount);

process.exit();

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

const largeArray = new Array(100000).fill(0);

const nest = make<any>({
	cool: true,
	deep: { nest: true },
	array: largeArray,
});

console.log(nest, isNest(nest), isNest({}));

once(Events.SET, nest, (data) => {
	console.log("all", data);
});
on(Events.SET, [nest, "cool"], (data) => {
	console.log("cool", data);
});

nest.cool = false;
silent(nest).cool = true;
try {
	shallow(nest).deep.in.nest = true;
} catch {
	console.log("Dies, good.");
}
deep(shallow(nest)).deep.in.nest = true;

console.log(nest);

// test("base object nestClasses: false", () => {
// 	const data = {
// 		object: { a: 1, b: 2 },
// 		array: [1, 2, 3],
// 		date: new Date(),
// 		regexp: /\d+/g,
// 		map: new Map([
// 			["a", 1],
// 			["b", 2],
// 		]),
// 		set: new Set([1, 2, 3]),
// 	};
// 	const nest = nests.make(data, { nestClasses: false });
// 	expect(nest.state).toStrictEqual(data);
// 	expect(nest.ghost).toStrictEqual(data);
// 	expect(nest.store).toStrictEqual(data);
// });

// test("base array nestClasses: false", () => {
// 	const data = [
// 		{ a: 1, b: 2 },
// 		[1, 2, 3],
// 		new Date(),
// 		/\d+/g,
// 		new Map([
// 			["a", 1],
// 			["b", 2],
// 		]),
// 		new Set([1, 2, 3]),
// 	];
// 	const nest = nests.make(data, { nestClasses: false });
// 	expect(nest.state).toStrictEqual(data);
// 	expect(nest.ghost).toStrictEqual(data);
// 	expect(nest.store).toStrictEqual(data);
// });

// test("large array state", () => {
// 	const data = { array: largeArray };
// 	const nest = nests.make<any>(data);
// 	nest.state.array.unshift(0);
// 	expect(nest.state.array.length).toBe(largeArray.length + 1);
// 	expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 	expect(nest.store.array.length).toBe(largeArray.length + 1);
// });
// test("large array ghost", () => {
// 	const data = { array: largeArray };
// 	const nest = nests.make(data);
// 	nest.ghost.array.unshift(0);
// 	expect(nest.state.array.length).toBe(largeArray.length + 1);
// 	expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 	expect(nest.store.array.length).toBe(largeArray.length + 1);
// });
// test("large array store", () => {
// 	const data = { array: largeArray };
// 	const nest = nests.make(data);
// 	nest.store.array.unshift(0);
// 	expect(nest.state.array.length).toBe(largeArray.length + 1);
// 	expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 	expect(nest.store.array.length).toBe(largeArray.length + 1);
// });
// test("large array bulk state", () => {
// 	const data = { array: largeArray };
// 	const nest = nests.make(data);

// 	nest.bulk((nest) => {
// 		nest.state.array.unshift(0);
// 		expect(nest.state.array.length).toBe(largeArray.length + 1);
// 		expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 		expect(nest.store.array.length).toBe(largeArray.length + 1);
// 	});

// 	expect(nest.state.array.length).toBe(largeArray.length + 1);
// 	expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 	expect(nest.store.array.length).toBe(largeArray.length + 1);
// });
// test("large array bulk ghost", () => {
// 	const data = { array: largeArray };
// 	const nest = nests.make(data);

// 	nest.bulk((nest) => {
// 		nest.ghost.array.unshift(0);
// 		expect(nest.state.array.length).toBe(largeArray.length + 1);
// 		expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 		expect(nest.store.array.length).toBe(largeArray.length + 1);
// 	});

// 	expect(nest.state.array.length).toBe(largeArray.length + 1);
// 	expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 	expect(nest.store.array.length).toBe(largeArray.length + 1);
// });
// test("large array bulk store", () => {
// 	const data = { array: largeArray };
// 	const nest = nests.make(data);

// 	nest.bulk((nest) => {
// 		nest.store.array.unshift(0);
// 		expect(nest.state.array.length).toBe(largeArray.length + 1);
// 		expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 		expect(nest.store.array.length).toBe(largeArray.length + 1);
// 	});

// 	expect(nest.state.array.length).toBe(largeArray.length + 1);
// 	expect(nest.ghost.array.length).toBe(largeArray.length + 1);
// 	expect(nest.store.array.length).toBe(largeArray.length + 1);
// });

// test("instant deep ghost", () => {
// 	const nest = nests.make<any>({});
// 	expect(nest.ghost.instant.deep).toStrictEqual({});
// 	nest.ghost.instant.deep = 0;
// 	expect(nest.state.instant.deep).toBe(0);
// 	expect(nest.ghost.instant.deep).toBe(0);
// 	expect(nest.store.instant.deep).toBe(0);
// });
// test("instant deep store", () => {
// 	const nest = nests.make<any>({});
// 	expect(nest.store.instant.deep).toStrictEqual({});
// 	nest.store.instant.deep = 0;
// 	expect(nest.state.instant.deep).toBe(0);
// 	expect(nest.ghost.instant.deep).toBe(0);
// 	expect(nest.store.instant.deep).toBe(0);
// });

// test("bulk state", () => {
// 	const nest = nests.make<any>({ instant: { deep: {} } });

// 	nest.bulk((nest) => {
// 		expect(nest.state.instant.deep).toStrictEqual({});
// 		nest.state.instant.deep = 0;
// 		expect(nest.state.instant.deep).toBe(0);
// 		expect(nest.ghost.instant.deep).toBe(0);
// 		expect(nest.store.instant.deep).toBe(0);
// 	});

// 	expect(nest.state.instant.deep).toBe(0);
// 	expect(nest.ghost.instant.deep).toBe(0);
// 	expect(nest.store.instant.deep).toBe(0);
// });
// test("bulk ghost", () => {
// 	const nest = nests.make<any>({});

// 	nest.bulk((nest) => {
// 		expect(nest.ghost.instant.deep).toStrictEqual({});
// 		nest.ghost.instant.deep = 0;
// 		expect(nest.state.instant.deep).toBe(0);
// 		expect(nest.ghost.instant.deep).toBe(0);
// 		expect(nest.store.instant.deep).toBe(0);
// 	});

// 	expect(nest.state.instant.deep).toBe(0);
// 	expect(nest.ghost.instant.deep).toBe(0);
// 	expect(nest.store.instant.deep).toBe(0);
// });
// test("bulk store", () => {
// 	const nest = nests.make<any>({});

// 	nest.bulk((nest) => {
// 		expect(nest.store.instant.deep).toStrictEqual({});
// 		nest.store.instant.deep = 0;
// 		expect(nest.state.instant.deep).toBe(0);
// 		expect(nest.ghost.instant.deep).toBe(0);
// 		expect(nest.store.instant.deep).toBe(0);
// 	});

// 	expect(nest.state.instant.deep).toBe(0);
// 	expect(nest.ghost.instant.deep).toBe(0);
// 	expect(nest.store.instant.deep).toBe(0);
// });

// test("custom cloner", () => {
// 	class Special {
// 		constructor(public value: number) {}
// 	}
// 	const nest = nests.make(
// 		{
// 			special: new Special(1),
// 		},
// 		{
// 			cloner: (item) => {
// 				if (item instanceof Special) {
// 					return "special";
// 				}
// 			},
// 		}
// 	);
// 	expect(nest.state.special).toBe("special");
// 	expect(nest.ghost.special).toBe("special");
// 	expect(nest.store.special).toBe("special");
// });

// test("custom deepCloner", () => {
// 	const nest = nests.make<any>(
// 		{},
// 		{
// 			cloner: {
// 				deep: true,
// 				function: () => {
// 					return {
// 						special: "special",
// 					};
// 				},
// 			},
// 		}
// 	);
// 	expect(nest.state.special).toBe("special");
// 	expect(nest.ghost.special).toBe("special");
// 	expect(nest.store.special).toBe("special");
// });
