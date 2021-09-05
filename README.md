<h1 align="center">Nests</h1>

<p align="center">
	Easy state storage with a lot of control.
</p>

---

<p align="center">
	<img src="https://badgen.net/github/watchers/Kyza/nests" />
	<img src="https://badgen.net/github/stars/Kyza/nests" />
	<img src="https://badgen.net/github/forks/Kyza/nests" />
	<img src="https://badgen.net/github/issues/Kyza/nests" />
	<img src="https://badgen.net/github/prs/Kyza/nests" />
	<img src="https://badgen.net/github/license/Kyza/nests" />
</p>
<p align="center">
	<img src="https://badgen.net/bundlephobia/min/nests" />
	<img src="https://badgen.net/bundlephobia/minzip/nests" />
	<img src="https://badgen.net/bundlephobia/dependency-count/nests" />
	<img src="https://badgen.net/bundlephobia/tree-shaking/nests" />
</p>
<p align="center">
	<img src="https://badgen.net/npm/v/nests" />
	<!-- <img src="https://badgen.net/npm/dw/nests" />
	<img src="https://badgen.net/npm/dm/nests" />
	<img src="https://badgen.net/npm/dy/nests" />
	<img src="https://badgen.net/npm/dt/nests" /> -->
	<img src="https://badgen.net/npm/dependents/nests" />
	<img src="https://badgen.net/npm/types/nests" />
</p>

---

```js
import { Nest, NestEvents } from "nests";
const { nest, emitter } = new Nest();

emitter.on(NestEvents.AFTER_SET, (path, value) => {
	console.log(`after-set: ${path} = ${value}`);
});

nest.array = [1, 2, 3];
nest.array.push(4);

/* Console Output */
// after-set: array = 1,2,3
// after-set: array,3 = 4
// after-set: array,length = 4
```

## Installation

```bash
npm i nests
```

## Links

- [GitHub](https://github.com/Kyza/nests)
- [NPM](https://www.npmjs.com/package/nests)
- [Bundlephobia](https://bundlephobia.com/package/nests@latest)

## Features

- [Instant Deeply Nested Objects](#instant-deeply-nested-objects)
- [The fastArrays Option](#the-fastarrays-option)
- [NestEvents and EventEmitter](#nestevents-and-eventemitter)
- [useNest](#usenest)

## Concepts

First of all, if you are looking for _super speedy_ ways to store data, this is not the library for you. However, if you can deal with slightly slower response times in trade for a much easier API, this _is_ the library for you.

### Instant Deeply Nested Objects

Think of nests as a normal object, but instead of non-existant keys being `undefined` you get `{}`, an empty object. Every key already exists.

Every key already exists? Well, that's not _really_ true, but it's close. In order to provide an easier way to store data, any key you access will return an empty object if it doesn't exist. Keep in mind that just accessing a non-existent key for example `someFunction(nest.some.new.key)` won't create the empty data on the object.

So what does that even mean? This means that you can instantly set a deeply nested value without having to create the entire path manually.

Nests turns this mess:

```js
nest = { this: { is: { a: { nest: { with: { a: { key: "value" } } } } } } };
```

Into this clean implementation:

```js
nest.this.is.a.nest.with.a.key = "value";
```

There's a trap, however! Since nothing on the nest will ever return `undefined` your logic can suffer!

```js
// Does not work!
if (!nest.some.new.key) {
	nest.some.new.key = "value";
}

// Works!
if (!Object.keys(nest.some.new.key).length) {
	nest.some.new.key = "value";
}

// Best practice!
// Returns false for only {}.
if (!Nest.has(nest.some.new.key)) {
	nest.some.new.key = "value";
}
```

### References

Always remember references. If you set an object from the nest to an outside variable, that variable will become a reference to the nest and continue to trigger events. Use a deep copy function to copy the object if you want to detatch it from the nest.

### Arrays

_Please please please_ be careful when using arrays in your nests. They can be many times slower than normal which is devestating for performance on large arrays with ~100,000 items.

On my machine it takes ~13ms to use `unshift` on a normal array with 1,000,000 items, while it takes almost ~650ms to use unshift the same array in a nest.

**But don't run away just yet!**

If possible, try to use objects instead of arrays. If you absolutely need to use a large array in your nest, create a nest with the `fastArrays` option.

Remember references again! When transferring data from a nest to a normal array, remember to use a deep copy function (or the spread operator (`[...nest.array]`) if array items aren't objects) to get a normal array that isn't attached to the nest.

#### The fastArrays Option

If you are using a large array in your nest, you can use the `fastArrays` option to make it faster. This _drastically_ speeds arrays back up.

Using `fastArrays` boosts the speed from the large array example above to ~15ms.

However, there's a price. The emitter will no longer emit events from inside arrays. This means you will have to run `nest.array = nest.array` after modifying the array.

```js
const { nest, emitter } = new Nest({ fastArrays: true });

// Emits!
nest.array = [];

// Doesn't emit.
nest.array.push(1);

// Doesn't emit.
nest.array[1] = 2;

// Emits!
nest.array = nest.array;
```

There is another benefit, however. You no longer need to deep copy the array to detatch it from the nest since it was never attached in the first place.

## NestEvents and EventEmitter

Nests uses its own, fast, EventEmitter fit for browsers and a NodeJS environment.

```js
const { nest, emitter } = new Nest();

// You can also use `emitter.once` to only listen for the next event.
emitter.on(NestEvents.AFTER_SET, (path, value) => {
	// `someSetting` was enabled!
	console.log(`${path} = ${value}`); // someSetting,enabled = true
});

nest.someSetting.enabled = true;
```

### BEFORE_GET

This is called before a value is retrieved.

### AFTER_GET

This is called after a value is retrieved.

### BEFORE_SET

This is called before a value is set.

### AFTER_SET

This is called after a value is set.

### BEFORE_DEL

This is called before a value is deleted.

### AFTER_DEL

This is called after a value is deleted.

## useNest

Nest comes with a handy hook to connect it to a React component.

```js
import { Nest, useNest } from "nests";
const settingsNest = new Nest({
	data: {
		enabled: true,
		name: "",
	},
});
const { nest: settings } = settingsNest;

export default function App() {
	useNest({
		...settingsNest,
		// This is run for every emit and makes the hook only update the state if it returns true.
		// It's optional, but the default always returns true.
		filter: (data) => true,
	});

	return (
		<>
			<button
				onClick={() => {
					settings.enabled = !settings.enabled;
				}}
			>
				{settings.enabled ? "Enabled" : "Disabled"}
			</button>
			<input
				type="text"
				value={settings.name}
				onInput={(event) => {
					settings.name = event.target.value;
				}}
			/>
		</>
	);
}
```
