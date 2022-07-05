## 04 - Currying

Calling a function with only a subset of functions, returning a function that accepts the remaining arguments.

**Partial applicaiton**

**higher order function** - A function that takes or returns a function.

```js
const add = x => y => x + y;
const increment = add(1);
const addTen = add(10);

increment(2); // 3
addTen(2); // 12
```

The ability to "pre-load" a function with an argument or two in order to receive a new function that remembers the initial arguments.

We also have the ability to transform any function that works on single elements into a function that works on arrays simply by wrapping it with map:

```js
const getChildren = x => x.childNodes;
const allTheChildren = map(getChildren);
```

---
