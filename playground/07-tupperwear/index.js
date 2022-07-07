const {
  match,
  prop,
  add,
  inspect,
  compose,
  map,
  curry
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
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
    // console.log(this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`);
  }
}

// const result = Maybe.of('a string and an apple').map(match(/a/ig)); // true

// const result = Maybe.of({ name: 'Dinah', age: 14 }).map(prop('age')).map(add(10));

// const result = Maybe.of(null).map(match(/a/ig));

// const safeHead = xs => Maybe.of(xs[0]);

// const streetName = compose(map(prop('street')), safeHead, prop('addresses'));

// const myObj = {
//   addresses: [{ street: 'Shady ln.', number: 4201 }]
// }

// // console.log('streetName(myObj) ==>', streetName(myObj));
// streetName(myObj).inspect();

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
// const getTwenty = compose(map(finishTransaction), withdraw(20));


// getTwenty({ balance: 200.00 }); 
// Just('Your balance is $180')

// console.log(getTwenty({ balance: 10.00 }).inspect());
// Nothing

// maybe :: b -> (a -> b) -> Maybe a -> b
const maybe = curry((v, f, m) => {
  if (m.isNothing) {
    return v;
  }

  return f(m.$value);
});

// getTwenty :: Account -> String
const getTwenty = compose(maybe('You\'re broke!', finishTransaction), withdraw(20));

console.log(getTwenty({ balance: 200.00 }))
// 'Your balance is $180.00'

// getTwenty({ balance: 10.00 }).inspect();
// 'You\'re broke!'

