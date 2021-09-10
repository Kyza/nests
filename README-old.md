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
	<img src="https://badgen.net/npm/dw/nests" />
	<img src="https://badgen.net/npm/dm/nests" />
	<img src="https://badgen.net/npm/dy/nests" />
	<img src="https://badgen.net/npm/dt/nests" />
	<img src="https://badgen.net/npm/dependents/nests" />
	<img src="https://badgen.net/npm/types/nests" />
</p>

---

```js
import { Nest, NestEvents } from "nests";
const { nest, emitter } = new Nest();

emitter.on(NestEvents.SET, ({ nest, path, value }) => {
	console.log(`set: ${path} = ${value}`);
});

nest.array = [1, 2, 3];
nest.array.push(4);

/* Console Output */
// set: array = 1,2,3
// set: array,3 = 4
// set: array,length = 4
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

### Instant Deeply Nested Objects

Think of nests as a normal object, but instead of non-existant keys being `undefined` you get `{}`, an empty object. Every key already exists.

Every key already exists? Well, that's not _really_ true, but it's close. In order to provide an easier way to store data, any key you access will return an empty object if it doesn't exist.

Keep in mind that just accessing a non-existent key for example `someFunction(nest.some.new.key)` _will_ create the empty data on the object.

So what does that even mean? This means that you can instantly set a deeply nested value without having to create the entire path manually.

Nests turns this mess:

```js
nest = { this: { is: { a: { nest: { with: { a: { key: "value" } } } } } } };
```

Into this clean implementation:

```js
nest.this.is.a.nest.with.a.key = "value";
```

#### The Trap

There's a trap, however! Since nothing on the nest will ever return `undefined` your logic can suffer!

```js
// Does not work!
if (!nest.some.new.key) {
	nest.some.new.key = "value";
}

// Best practice!
if (!nest.ghost.some.new.key) {
	nest.ghost.some.new.key = "value";
}
```

### References

Always remember references. If you set an object from the nest to an outside variable, that variable will become a reference to the nest and continue to trigger events. Use a deep copy function to copy the object if you want to detatch it from the nest.

### Arrays

If you want to get the most performance out of arrays in nests as possible, use the `fastArrays` option.

When you're using arrays that are greater in size than ~500 items use the `fastArrays` option.

Remember references again! When transferring data from a nest to a normal array, remember to use a deep copy function (or the spread operator (`[...nest.array]`) if array items aren't objects) to get a normal array that isn't attached to the nest.

#### The fastArrays Option

If you are using a large array in your nest, you can use the `fastArrays` option to make it faster. This drastically speeds arrays back up.

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
emitter.on(NestEvents.SET, ({ nest, path, value }) => {
	// `someSetting` was enabled!
	console.log(`${path} = ${value}`); // someSetting,enabled = true
});

nest.someSetting.enabled = true;
```

### GET

This is called after a value is retrieved.

### SET

This is called after a value is set.

### DEL

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
		filter: ({ nest, path, value }) => true,
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
