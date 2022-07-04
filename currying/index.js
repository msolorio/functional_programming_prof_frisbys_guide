// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));

// const hasLetterR = match(/r/g);

// const result = hasLetterR('just j and k and l');

// const strings = ['rock and roll', 'smooth jazz', 'hard bop'];

// const filterForRs = filter(hasLetterR);

// const rs = filterForRs(strings);

// console.log('rs ==>', rs);

