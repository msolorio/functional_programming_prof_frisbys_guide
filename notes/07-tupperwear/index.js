const {
  match,
  prop,
  add,
  inspect,
  compose,
  map,
  curry,
  concat,
  trace,
  toString,
  identity,
  split,
  last,
  eq,
  head,
  find
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
// const maybe = curry((v, f, m) => {
//   if (m.isNothing) {
//     return v;
//   }

//   return f(m.$value);
// });

// // getTwenty :: Account -> String
// const getTwenty = compose(maybe('You\'re broke!', finishTransaction), withdraw(20));

// console.log(getTwenty({ balance: 200.00 }))
// 'Your balance is $180.00'

// getTwenty({ balance: 10.00 }).inspect();
// 'You\'re broke!'

///////////////////////////////////////////////////////////////////
// Error Handling

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

////////////////////////////////////////////////////////////////////////
Either.of('rain').map(str => `b${str}`).inspect();
// Right('brain')

left('rain').map(str => `b${str}`).inspect();
// Left('rain') // the left's map does not execute the callback.

Either.of({ host: 'localhost', port: 80 }).map(prop('host')).inspect();
// Right('localhost') // the right's map will execute the callback.


////////////////////////////////////////////////////////////////////////
// Implement a function that might not succeed

const moment = require('moment');

// getAge :: Date -> User -> Either(String, Number)
const getAge = curry((now, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD');

  return (
    birthDate.isValid()
    ? Either.of(now.diff(birthDate, 'years'))
    : left('Birth date could not be parsed.')
  );
})

// getAge(moment(), { birthDate: '2005-12-12' }).inspect();
// Right(16)

// getAge(moment(), { birthDate: 'July 4, 2001' }).inspect();
// Left('Birth date could not be parsed')

/////////////////////////////////////////////////////////////////////////
// Branching within a chain

// fortune :: Number -> String
const fortune = compose(
  concat('If you survive, you will be '),
  toString,
  add(1)
);

// zoltar :: User -> Either(String, _)
// getAge :: User -> Right(Number) / Left(String)
// map ::  Right / Left -> console.log output / Left(String)

const zoltar = compose(map(console.log), map(fortune), getAge(moment()));

// zoltar({ birthDate: '2005-12-12' }).inspect();
// log ->'If you survive, you bill be 10'
// Right(undefined)

// console.log(zoltar({ birthDate: 'dogs' }).inspect());
// Left('Birth date could not be parsed.')

/*
Notes
- fortune is completely ignorant of the use of a functor
- Lifting - by wrapping the function in a map, it is "lifted" into the container.
*/

///////////////////////////////////////////////////////////////////////////
// either helper function
// either :: (a -> c) -> (b -> c) -> a | b -> c

// Here, either returns the value and not the functor
const either = curry((f, g, e) => {
  switch(e.constructor) {
    case Left:
      return f(e.$value);

    case Right:
      return g(e.$value);
  }
})

// const zoltar2 = compose(console.log, either(identity, fortune), getAge(moment()));
// const zoltar2 = compose(console.log, either(identity, fortune), getAge(moment()));

// zoltar2({ birthDate: '2000-12-12' });

///////////////////////////////////////////////////////////////////////////
// class IO {
//   static of(x) {
//     return new IO(() => x);
//   }

//   constructor(fn) {
//     this.$value = fn; // this.$value is a function that returns x
//   }

//   map(fn) {
//     return new IO(compose(fn, this.$value))
//   }

//   inspect() {
//     return `IO(${inspect(this.$value())})`;
//   }
// }

// const ioProcess = new IO(() => process);

// console.log(ioProcess.$value());

// console.log(ioProcess.map(process => process.version).$value());
// console.log(ioProcess.map(prop('version')).$value());

// const nodeVersion = ioProcess
//   .map(prop('versions'))
//   .map(prop('node'))
//   .inspect();

// console.log('nodeVersion ==>', nodeVersion);

// // const pathMembers = ioProcess
// //   .map(prop('mainModule'))
// //   .map(prop('path'))
// //   .map(split('/'))
// //   .inspect();

// const pathMembers = ioProcess
//   .map(compose(split('/'), prop('path'), prop('mainModule')))
//   .inspect();

// console.log('pathMembers ==>', pathMembers);

/////////////////////////////////////////////////////////////////////////////////
// Using the IO Functor to wrap I/O side effects and trigger them when needed in
// an obvious way with .unsafePerformIO()

class IO {
  constructor(io) {
    this.unsafePerformIO = io;
  }

  map(fn) {
    return new IO(compose(fn, this.unsafePerformIO));
  }
}

// simulates pulling the URL from the browser window
const url = new IO(() => 'https://mywebsite.com?param1=val1&param2=val2');

/////////////////////////////////////////////////////////////////////////////////
// Pull the value of a query param by its name

// toPairs :: String -> [[String]]
const toPairs = compose(map(split('=')), split('&'));

// params :: String -> [[String]]
const params = compose(toPairs, last, split('?'));

// findParam :: String -> IO Maybe [String]
const findParam = key => map(compose(Maybe.of, find(compose(eq(key), head)), params), url);


console.log(findParam('param3').unsafePerformIO());
