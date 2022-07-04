// Refactor to remove all arguments by partially applying the functions.

// filterQs :: [String] -> [String]
const filterQs = filter(match(/q/i));
// const filterQs = filter(s => s.match(/q/i));
// const filterQs = xs => xs.filter(s => s.match(/q/i));
