import { objectExpression } from "@babel/types";
import Store from "./src/index.js";

const { store, emitter } = new Store({ defaultValues: () => "test" });

// emitter.on("before-set", (path, value) => {
// 	console.log(`Will set ${path} to ${value}.`, store);
// });
// emitter.on("after-set", (path, value) => {
// 	console.log(`Set ${path} to ${value}.`, store);
// });
// emitter.on("after-del", (path, oldValue) => {
// 	console.log(`Deleted ${path}.`, store);
// });

test("Setting a shallow value", () => {
	store.depth1 = "test";
	expect(store.depth1).toBe("test");
});
test("Reassigning a shallow value", () => {
	store.depth1 = "test2";
	expect(store.depth1).toEqual("test2");
});
test("Deleting a shallow value", () => {
	delete store.depth1;
	expect(typeof store.depth1).toBe("object");
	expect(Object.keys(store.depth1).length).toBe(0);
});

test("Setting a deep value", () => {
	store.depth1.depth2.depth3 = "test";
	expect(store.depth1.depth2.depth3).toBe("test");
});
test("Reassigning a deep value", () => {
	store.depth1.depth2.depth3 = "test";
	expect(store.depth1.depth2.depth3).toBe("test");
});
test("Setting a deep value to a function", () => {
	store.depth1.depth2.depth3 = () => "test";
	expect(store.depth1.depth2.depth3()).toBe("test");
});
test("Deleting a deep value", () => {
	delete store.depth1.depth2.depth3;
	expect(typeof store.depth1.depth2.depth3).toBe("object");
	expect(Object.keys(store.depth1.depth2.depth3).length).toBe(0);
});

delete store.depth1;

test("Setting an array", () => {
	store.depth1 = ["test"];
	expect(store.depth1).toContain("test");
});
