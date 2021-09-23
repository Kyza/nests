<h1 align="center">Nests</h1>

<p align="center">
	Fast and easy state storage with a lot of control.
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
import * as nests from "nests";
const nest = nests.make();

nest.on(nests.Events.SET, ({ path, value }) => {
	console.log(`set: ${path} = ${value}`);
});

nest.store.array = [1, 2, 3];
nest.store.array.push(4);

/* Console Output */
// set: array = 1,2,3
// set: array,3 = 4
// set: array,length = 4
```

## Installation

```bash
npm i nests
```

When importing you can specify `nests/esm` or `nests/mjs` if your bundler is giving you problems.

```js
import * as nests from "nests";
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

### Store

The store is an object that lets you store data in an instantly deeply nested structure which automatically emits events to subscribers for you.

#### Instant Deeply Nested Objects

Have you ever had to do something like this?

```js
const storage = {};

if (!storage.hasOwnProperty("foo")) {
	storage.foo = "bar";
}
```

With Nests this isn't necessary anymore.

```js
const nest = nests.make();

nest.store.foo = "bar";
```

The code is even shorter and more readable.

You can go as deep as you want instantly without having to check if the property exists.

```js
nest.store.foo.bar.baz = "qux";
```

Getting a property that doesn't exist will return `{}` instead of `undefined`. Use [ghost](#ghost) to check for non-existent properties correctly.

```js
nest.store.foo.bar.baz; // {}
```

### Automatic Events

Nests comes with a small, custom, and fast, browser-ready EventEmitter.

```js
nest.on(nests.Events.SET, ({ path, value }) => {
	console.log(`set: ${path} = ${value}`);
});

nest.store.array = [1, 2, 3];
nest.store.array.push(4);

/* Console Output */
// set: array = 1,2,3
// set: array,3 = 4
// set: array,length = 4
```

### Ghost

The ghost is an object that is dual-synced with the store but isn't instantly deeply nested, doesn't emit events and is faster.

Each nest has a `ghost` property that can be used to modify the store's data without triggering events. This is super handy for doing heavy calculations with many mutations and creating transient React components easily.

The ghost of each nest is directly tied to the store so modifications to the ghost will be reflected in the store.

```js
nest.on(nests.Events.SET, ({ path, value }) => {
	console.log(`set: ${path} = ${value}`);
});

nest.ghost.array = [1, 2, 3];
nest.ghost.array.push(4);

nest.store.array.push(5);

console.log("The sync goes both ways:", nest.ghost.array);

/* Console Output */
// set: array,4 = 5
// set: array,length = 5
// The sync goes both ways: 1,2,3,4,5
```

If you want to trigger an event manually without using the store, you can use any of these functions.

```js
// Use this.
nest.update();
// Using these is discouraged.
nest.get();
nest.set();
nest.delete();
```

The downfall of ghost is that it doesn't support [Instant Deeply Nested Objects](#instant-deeply-nested-objects).

```js
nest.ghost.foo.bar.baz = "qux"; // Error!
```

This is also a good thing. It allows you to check for non-existent properties unlike the store.

```js
if (!nest.ghost.foo?.bar?.baz) {
	// ...
}
```

## React

Here's an example of a React component.

```js
import * as nests from "nests";
import { useNest } from "nests/react";

const settings = nests.make({
	enabled: true,
	name: "",
});

export default function App() {
	// Automatically subscribe to changes in the store.
	useNest(settings);

	return (
		<>
			<button
				onClick={() => {
					settings.store.enabled = !settings.store.enabled;
				}}
			>
				{settings.ghost.enabled ? "Enabled" : "Disabled"}
			</button>
			<input
				type="text"
				value={settings.ghost.name}
				onInput={(event) => {
					settings.store.name = event.target.value;
				}}
			/>
		</>
	);
}
```

Here's an example of a transient React component.

```js
import * as nests from "nests";
import { useNest } from "nests/react";

const counter = nests.make({
	count: 0,
});

setInterval(() => {
	// Increment using the ghost to not update the component.
	counter.ghost.count++;
}, 0);

export default function App() {
	// Automatically subscribe to changes in the store.
	// Pass true to indicate that it's a transient component.
	// Here we have a filter as well to only update the component when we want to.
	// That lets us avoid updating the component when a property we don't care about is changed.
	useNest(
		counter,
		true,
		(event, type) => event === "UPDATE" && type === "counter"
	);

	return (
		<>
			{counter.ghost.count}
			<button
				onClick={() => {
					// Whenever the button is clicked, cause an update on the store.
					// You can pass data to the update function which passes it to the filter in the useNest above.
					counter.update("counter");
				}}
			>
				Update
			</button>
		</>
	);
}
```

Notice that whenever any data is displayed the ghost is used to retrieve it. This is because the ghost is faster and doesn't emit events.
