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
  find,
  Task,
  append,
  toUpperCase,
  safeProp
} = require('../../mostly-adequate-guide/support');

const axios = require('axios').default;

////////////////////////////////////////////////////////////////////////
class Container {
  constructor(x) {
    this.$value = x;
  }

  static of(x) {
    return new Container(x);
  }

  map(fn) {
    return Container.of(fn(this.$value))
  }

  inspect() {
    return `Just(${this.$value})`;
  }
}


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
class IO {
  static of(x) {
    return new IO(() => x);
  }

  constructor(fn) {
    this.$value = fn; // this.$value is a function that returns x
  }

  map(fn) {
    return new IO(compose(fn, this.$value))
  }

  inspect() {
    return `IO(${inspect(this.$value())})`;
  }
}

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

// class IO {
//   constructor(io) {
//     this.unsafePerformIO = io;
//   }

//   map(fn) {
//     return new IO(compose(fn, this.unsafePerformIO));
//   }
// }

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


// console.log(findParam('param2').unsafePerformIO());

/////////////////////////////////////////////////////////////////////////////////
// Async code
const fs = require('fs');

const getJSON = curry((url, params) => new Task((reject, resolve) => {
  axios.get(url, params)
    .then(resolve)
    .catch(reject)
}))

const getJSONTask = getJSON('https://api.kanye.rest/', null)
  .map(compose(prop('quote'), prop('data')));

// getJSONTask.fork(
//   error => console.log('error:', error),
//   result => console.log('data:', result)
// );

const readFile = filename => new Task((reject, resolve) => {
  fs.readFile(filename, 'utf-8', (err, data) => err ? reject(err) : resolve(data));
});

// const readTask = readFile('test.txt').map(split('\n')).map(head);
const readTask = readFile('test.txt').map(split('\n')).map(head);

// readTask.fork(
//   error => console.log('error:', error),
//   line => console.log('line:', line)
// )

// const result = Task.of(3).map(num => num + 1);
const numTask = Task.of(3);
// numTask.fork(
//   error => console.log('error:', error),
//   num => console.log('num:', num)
// );

////////////////////////////////////////////////////////////
const idLaw1 = map(identity);
const idLaw2 = identity;

// console.log(idLaw1(Container.of(2)).inspect()); // Just(2)
// console.log(idLaw2(Container.of(2)).inspect()); // Just(2)

// const compLaw1 = compose(map(append(' run')), map(append(' spot')));
// const compLaw2 = map(compose(append(' run'), append(' spot')));

// console.log(compLaw1(Container.of('See')).inspect());
// console.log(compLaw2(Container.of('See')).inspect());

////////////////////////////////////////////////////////////
const nested = Task.of([Either.of('pillows'), left('no sleep for you')]);

// map(map(map(toUpperCase)), nested).fork(
//   (err) => console.log(err),
//   (data) => console.log('data:', data)
// );
// Task([Right('PILLOWS'), Left('no sleep for you')])

///////////////////////////////////////////////////////////
// incrF :: Functor f => f Int -> f Int
const incrF = map(add(1));
const myVal = incrF(Container.of(2)).inspect();

// console.log('myVal ==>', myVal);

////////////////////////////////////////
// initial :: User -> Maybe String
const initial = compose(
  map(head),
  safeProp('name')
);

const maybeStr = initial({
  id: 2,
  name: 'Albert',
  active: true,
});

// console.log('maybeStr ==>', maybeStr)

//////////////////////////////////////////////////////////
// Given the following helper functions:
//
  // showWelcome :: User -> String
  const showWelcome = compose(concat('Welcome '), prop('name'));

  // checkActive :: User -> Either String User
  const checkActive = function checkActive(user) {
    return user.active
      ? Either.of(user)
      : left('Your account is not active');
  };

// Write a function that uses `checkActive` and `showWelcome` to grant access or return the error.

// eitherWelcome :: User -> Either String String
const eitherWelcome = compose(
  map(showWelcome),
  checkActive,
);

const result = eitherWelcome({
  active: true,
  name: 'Victor'
});

// console.log('result.inspect() ==>', result.inspect())

///////////////////////////////////////////////////////////
// We now consider the following functions:
//
//   // validateUser :: (User -> Either String ()) -> User -> Either String User
const validateUser = curry((validate, user) => validate(user).map(_ => user));
//
//   // save :: User -> IO User
const save = user => new IO(() => ({ ...user, saved: true }));
//
// Write a function `validateName` which checks whether a user has a name longer than 3 characters
// or return an error message. Then use `either`, `showWelcome` and `save` to write a `register`
// function to signup and welcome a user when the validation is ok.
//
// Remember either's two arguments must return the same type.

// validateName :: User -> Either String ()
const validateName = user => {
  return user.name.length > 3
    ? Either.of(user.name)
    : left('Name should be longer than 3 characters.');
};

const saveAndWelcome = compose(map(showWelcome), save);

// register :: User -> IO String
const register = compose(
  either(IO.of, saveAndWelcome),
  validateUser(validateName),
);

const result2 = register({
  name: 'Lut'
});

console.log('result2 ==>', result2.$value());














