## 08 - Tupperware

A container can hold any type of value.

```js

class Container {
  constructor(x) {
    this.$value = x;
  }

  static of(x) {
    return new Container(x);
  }
}

Container.of(3);
// Container(3)
// { $value: 3 }

Container.of(Container.of({ name: 'yoda' }));
// Container(Container({ name: 'yoda' }));
// { $value: { $value: { name: 'yoda' } } }

```

---

### Functors
- A functor is
  - a container-like type that implements map
  - An interface with a contract

  - Provides abstraction of function application
  - **TODO: come back to this**

Adding a method to the container

```js
// (a -> b) -> Container a -> Container b
Container.prototype.map = function (f) {
  return Container.of(f(this.$value));
};

Container.of(2).map(two => two + 2); 
// Container(4)

Container.of('flamethrowers').map(s => s.toUpperCase()); 
// Container('FLAMETHROWERS')

Container.of('bombs').map(append(' away')).map(prop('length')); 
// Container(10)
```

---

### Schrödinger's Maybe

A Maybe Functor accounts for the possibility that the value is null / undefined.
- If the internal map method is called with an `isNothing` Functor, the Functor is returned and the callback is not applied.

```js
const {
  match,
  prop,
  add,
  inspect,
  compose,
  map
} = require('../../mostly-adequate-guide/support');


// Lesson code /////////////////////////////////////////////////////////
class Maybe {
  static of(x) {
    return new Maybe(x)
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  inspect() {
    // return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
    console.log(this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`);
  }
}

// const result = Maybe.of('a string and an apple').map(match(/a/ig)); // true

// const result = Maybe.of({ name: 'Dinah', age: 14 }).map(prop('age')).map(add(10));

// const result = Maybe.of(null).map(match(/a/ig));

const safeHead = xs => Maybe.of(xs[0]);

const streetName = compose(map(prop('street')), safeHead, prop('addresses'));

const myObj = {
  addresses: [{ street: 'Shady ln.', number: 4201 }]
}

// console.log('streetName(myObj) ==>', streetName(myObj));
streetName(myObj).inspect();
```

```js
// withdraw :: Number -> Account -> Maybe(Account)
const withdraw = curry((amount, { balance }) =>
  Maybe.of(balance >= amount ? { balance: balance - amount } : null));

// This function is hypothetical, not implemented here... nor anywhere else.
// updateLedger :: Account -> Account 
const updateLedger = account => account;

// remainingBalance :: Account -> String
const remainingBalance = ({ balance }) => `Your balance is $${balance}`;

// finishTransaction :: Account -> String
const finishTransaction = compose(remainingBalance, updateLedger);


// getTwenty :: Account -> Maybe(String)
const getTwenty = compose(map(finishTransaction), withdraw(20));
```

```js
getTwenty({ balance: 200.00 }).inspect(); 
// => Just('Your balance is $180')
```

In this case we don't have enough balance so the inspect returns 'Nothing'
```js
getTwenty({ balance: 10.00 }).inspect();
// => Nothing
```

We can instead provide a stand in value for nothing values using the maybe helper as an escape hatch.
- If we get a nothing value, we instead return the stand-in 'You\'re broke!'
```js
// maybe :: b -> (a -> b) -> Maybe a -> b
const maybe = curry((v, f, m) => {
  if (m.isNothing) {
    return v;
  }

  return f(m.$value);
});

// getTwenty :: Account -> String
const getTwenty = compose(maybe('You\'re broke!', finishTransaction), withdraw(20));

getTwenty({ balance: 200.00 }); 
// 'Your balance is $180.00'

getTwenty({ balance: 10.00 }); 
// 'You\'re broke!'

```

---

## Error Handling

```js
class Either {
  static of(x) {
    return new Right(x);
  }

  constructor(x) {
    this.$value = x;
  }
}

class Left extends Either {
  map(f) {
    return this;
  }

  inspect() {
    return `Left(${inspect(this.$value)})`;
  }
}

class Right extends Either {
  map(f) {
    return Either.of(f(this.$value));
  }

  inspect() {
    return `Right(${inspect(this.$value)})`;
  }
}

const left = x => new Left(x);
```

[See playground code for further implementation]