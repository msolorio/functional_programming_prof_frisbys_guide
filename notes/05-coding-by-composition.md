## 05 - Coding by Composing
- Piping data through a series of functions.
- Combining functions

```js
const compose = (f, g) => x => f(g(x))

const toUpperCase = x => x.toUpperCase();
const exclaim = x => `${x}!`;

const shout = compose(exclaim, toUpperCase);

shout('send in the clowns') // => 'SEND IN THE CLOWNS!';
```

Above, the functions are applied from right to left.

---

In some cases, the order matters.

```js
const head = xs => xs[0];

// returns a functions that takes an array and reverses it
const reverse = reduce((acc, x) => [x, ...acc], []);

// reverses list and retrieves the head.
// compose apples from right to left
const getLast = compose(head, reverse);
```

#### Associativity
```js
compose(f, compose(g, h)) === compose(compose(f, g), h);
```

---

### Pointfree
- Composing functions that do not mention the data on which they operates.
- Keeps the code concise and generic.
- Sometimes pointfree can sometimes hide the intention of code so not always best option.

```js
// not pointfree because we mention the data: word
const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_');

// pointfree
// replace is partially applied with first 2 args returning a function.
// doesn't need to mention data bc compose returns a function taking the data.
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

```js
// not pointfree because we mention the data: name
const initials = name => name.split(' ').map(compose(toUpperCase, head)).join('. ');

// pointfree
// NOTE: we use 'intercalate' from the appendix instead of 'join' introduced in Chapter 09!
const initials = compose(intercalate('. '), map(compose(toUpperCase, head)), split(' '));

initials('hunter stockton thompson'); // 'H. S. T'
```

---

### Debugging
- Trace function can be usefull for debugging a string of composed functions.
- Trace can be partially applied with a tag. And will log out the tag and the args.

```js
const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const dasherize = compose(
  intercalate('-'),
  toLower,
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire');
// TypeError: Cannot read property 'apply' of undefined
```

Apply trace to print out args at a particular location in the chain.
```js
const dasherize = compose(
  intercalate('-'),
  toLower,
  trace('after split'),
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire');
// after split [ 'The', 'world', 'is', 'a', 'vampire' ]
// The function works after split.
```

After split the return value is an array. To lower needs to instead be applied to each item in the array.

```js
const dasherize = compose(
  intercalate('-'),
  map(toLower),
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire'); // 'the-world-is-a-vampire'
```

---

### Category Theory

An abstract branch of mathamatics that formalizes concepts with

- objects - in this case data types
- morphisms - pure functions
- composition on morphisms - function composition
- identity - a morphism that returns its input
  - `x => x`

---