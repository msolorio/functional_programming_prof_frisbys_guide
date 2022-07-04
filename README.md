# Professor Frisby's Mostly Adequate Guide to Functional Programming
https://mostly-adequate.gitbook.io/mostly-adequate-guide/

## Pure function
A pure function is a function that, given the same input, will always return the same output and does not have any observable side effect.

Using functions in a mathematical sense.

### Benefits of Pure functions
- self-documenting
- portable
- cachable - using memoization
- easy to test
- **referential transparency**
  - A function can be replaced by its result without changing the behavior of the program. 
  - Makes code much easier to reason about and compose pieces together.
- **Parallel code**
  - Pure functions can be run in parallel because they are not accessing shared state.
  - Cannot have race conditions due to side effects.
  - Can be possible in JS
    - with threads on server
    - Web workers in the browser

### Side Effect
A side effect is a change of system state or observable interaction with the outside world that occurs during the calculation of a result.

---

## Currying

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