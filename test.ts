import * as nests from "./src";

const largeArray = new Array(100000).fill(0);

const nest = nests.make<any>({
	cool: true,
	deep: { nest: true },
	array: largeArray,
});

nests.on(nests.Events.SET, [nest, "cool"], function (data) {
	console.log("cool changed", data);
});
nests.on(nests.Events.SET, nest, function (data) {
	console.log("nest changed", data);
});

nest.cool = false;
nest.deep.nest = false;

// Error!
nests.shallow(nest).instant.deep.nest = false;

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
