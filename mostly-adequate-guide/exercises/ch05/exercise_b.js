// Considering the following function:
//
//   const average = xs => reduce(add, 0, xs) / xs.length;
//
// Use the helper function `average` to refactor `averageDollarValue` as a composition.

const averageDollarValue = compose(average, map(prop('dollar_value')));
// const averageDollarValue = compose(average, map(c => c.dollar_value));
// const averageDollarValue = compose(xs => reduce(add, 0, xs), xs => xs.map(c => c.dollar_value));

// averageDollarValue :: [Car] -> Int
// const averageDollarValue = (cars) => {
//   const dollarValues = map(c => c.dollar_value, cars);
//   return average(dollarValues);
// };
