// Refactor `fastestCar` using `compose()` and other functions in pointfree-style.

// const trace = curry((tag, x) => {
//   console.log(tag, x);
//   return x;
// });

const fastestCar = compose(
  append(' is the fastest'),
  prop('name'),
  last,
  sortBy(prop('horsepower')),
);
// const fastestCar = compose(sortBy(c => c.horsepower));

// fastestCar :: [Car] -> String
// const fastestCar = (cars) => {
//   const sorted = sortBy(car => car.horsepower, cars);
//   const fastest = last(sorted);
//   return concat(fastest.name, ' is the fastest');
// };
