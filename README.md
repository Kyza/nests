<h1 align="center">Nests</h1>

<p align="center">
	Easy state storage with a lot of control.
</p>

---

<a href="https://github.com/Kyza/nests" align="center">
	<h2>GitHub</h2>
</a>
<p align="center">
	<img src="https://badgen.net/github/watchers/Kyza/nests" />
	<img src="https://badgen.net/github/stars/Kyza/nests" />
	<img src="https://badgen.net/github/forks/Kyza/nests" />
	<img src="https://badgen.net/github/issues/Kyza/nests" />
	<img src="https://badgen.net/github/prs/Kyza/nests" />
	<img src="https://badgen.net/github/license/Kyza/nests" />
</p>
<a href="https://bundlephobia.com/package/nests@latest" align="center">
	<h2>Bundlephobia</h2>
</a>
<p align="center">
	<img src="https://badgen.net/bundlephobia/min/nests" />
	<img src="https://badgen.net/bundlephobia/minzip/nests" />
	<img src="https://badgen.net/bundlephobia/dependency-count/nests" />
	<img src="https://badgen.net/bundlephobia/tree-shaking/nests" />
</p>
<a href="https://www.npmjs.com/package/nests" align="center">
	<h2>NPM<h2>
</a>
<p align="center">
	<img src="https://badgen.net/npm/v/nests" />
	<!-- <img src="https://badgen.net/npm/dw/nests" />
	<img src="https://badgen.net/npm/dm/nests" />
	<img src="https://badgen.net/npm/dy/nests" />
	<img src="https://badgen.net/npm/dt/nests" /> -->
	<img src="https://badgen.net/npm/dependents/nests" />
</p>

---

```js
import { Nest, NestEvents } from "nests";
const { store, emitter } = new Nest();

emitter.on({
	event: NestEvents.AFTER_SET,
	id: "AFTER_SET_EXAMPLE",
	listener: (path, value) => {
		console.log(`after-set: ${path} = ${value}`);
	},
});

store.array = [1, 2, 3];
store.array.push(4);

/* Console Output */
// after-set: array = 1,2,3
// after-set: array,3 = 4
// after-set: array,length = 4
```

---

## Concepts

First of all, if you are looking for _super speedy_ ways to store data, this is not the library for you. However, if you can deal with slightly slower response times in trade for a much easier API, this _is_ the library for you.

### How can I think of this data structure?

Think of nests as a normal object, but instead of non-existant keys being `undefined` you get `{}`, an empty object. Every key already exists.

### Instant Deeply Nested Objects

Every key already exists? Well, that's not _really_ true, but it's close. In order to provide an easier way to store data, any key you access will return an empty object if it doesn't exist. Keep in mind that just accessing a non-existent key for example `someFunction(store.some.new.key)` won't create the empty data on the object.

So what does that even mean? This means that you can instantly set a deeply nested value without having to create the entire path manually.

Nests turns this mess:

```js
store = { this: { is: { a: { nest: { with: { a: { key: "value" } } } } } } };
```

Into this clean implementation:

```js
store.this.is.a.nest.with.a.key = "value";
```

There's a trap, however! Since nothing on the store will ever return `undefined` your logic can suffer!

```js
// Does not work!
if (!store.some.new.key) {
	store.some.new.key = "value";
}

// Works!
if (!Object.keys(store.some.new.key).length) {
	store.some.new.key = "value";
}

// Lodash.
if (_.isEmpty(store.some.new.key)) {
	store.some.new.key = "value";
}
```

### References

Always remember references. If you set an object from the nest to an outside variable, that variable will become a reference to the nest and continue to trigger events. Use a deep copy function to copy the object if you want to detatch it from the nest.

### Arrays

_Please please please_ be careful when using arrays in your nests. They can be many times slower than normal which is devestating for performance on large arrays with ~100,000 items.

On my machine it takes ~10ms to use `unshift` on a normal array with 1,000,000 items, while it takes almost ~750ms to use unshift the same array in a nest.

If possible, try to use objects instead of arrays. If you absolutely need to use a large array in your nest, create a nest with the `fastArrays` option.

Remember references again! When transferring data from a nest to a normal array, remember to use a deep copy function (or the spread operator (`[...store.array]`) if array items aren't objects) to get a normal array that isn't attached to the nest.

#### The `fastArrays` Option

If you are using a large array in your nest, you can use the `fastArrays` option to make it faster. This brings arrays back to around the speed of JavaScript's native array methods.

However, there's a price. The emitter will no longer emit events when you push or splice items. This means you will have to assign to the array directly to get events to emit.

```js
const { store, emitter } = new Nest({ fastArrays: true });
```

## Events

Nests uses the [EventEmitter](https://nodejs.org/api/events.html) from NodeJS to dispatch events.

```js
const { store, emitter } = new Nest();

// You can also use `emitter.once` to only listen for the next event.
emitter.on({
	event: NestEvents.AFTER_SET,
	id: "SETTINGS",
	listener: (path, value) => {
		// `someSetting` was enabled!
		console.log(`${path} = ${value}`); // someSetting,enabled = true
	},
});

store.someSetting.enabled = true;
```

### `before-get`

This is called before a value is retrieved.

### `after-get`

This is called after a value is retrieved.

### `before-set`

This is called before a value is set.

### `after-set`

This is called after a value is set.

### `before-del`

This is called before a value is deleted.

### `after-del`

This is called after a value is deleted.
