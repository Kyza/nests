# Nests

Simple stores with a lot of control.

```js
import Store from "./src/index.js";
const { store, emitter } = new Store();

emitter.on("after-set", (path, value) => {
	console.log(`after-set: ${path} = ${value}`);
});

store.array = [1, 2, 3];
store.array.push(4);

console.log(store);

/* Console Output */
// after-set: array = 1,2,3
// after-set: array,3 = 4
// after-set: array,length = 4
```

## Concepts

First of all, if you are looking for effecient ways to store data, this is **_not_** the library for you. However, if you can deal with slightly slower response times in trade for an easier API, this **_is_** the library for you.

### How can I think of this data structure?

Think of nests as a normal object, but instead of non-existant keys being `undefined` you get `{}`, an empty object. Every key already exists.

### Instant Deeply Nested Objects

Every key already exists? Well, that's not _really_ true, but it's close. In order to provide an easier way to store data, any key you access will return an empty object if it doesn't exist. Keep in mind that _it doesn't create_ the key.

So what does that even mean? This means that you can instantly set a deeply nested value without having to create the entire path manually.

Nests turns this mess:

```js
store = { this: { is: { a: { nest: { with: { a: { key: "value" } } } } } } };
```

Into this clean implementation:

```js
store.this.is.a.nest.with.a.key = "value";
```

### References

Always remember references. If you set an object from the nest to an outside variable, that variable will become a reference to the nest and continue to trigger events. Use a deep copy method to copy the object if you want to detatch it from the nest.

### Arrays

_Please please please_ be careful when using arrays in your nests. They can be many times slower than normal which is devestating for performance on large arrays with ~100,000 items.

On my machine it takes ~10ms to use unshift on a normal array with 1,000,000 items, while it takes almost ~750ms to use unshift the same array in a nest.

If possible, try to use objects instead of arrays. If you absolutely need to use a large array, run the calculation outside of the nest and assign the new array to the array inside of the nest.

Remember references again! When transferring data from a nest to a normal array, remember to use the spread operator (`[...store.array]`) to get a normal array that isn't attached to the nest.

## Events

Nests uses the [EventEmitter](https://nodejs.org/api/events.html) from NodeJS to dispatch events.

```js
const { store, emitter } = new Store();

// You can also use `emitter.once` to only listen for the next event.
emitter.on("after-set", (path, value) => {
	// `someSetting` was enabled!
	console.log(`${path} = ${value}`); // someSetting,enabled = true
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
