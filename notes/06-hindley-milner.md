## Hindley Milner

Hindley-Milner type signatures are ubiquitous in the functional world.

A sytax for declaring the type signiture of functions

strLength :: String -> String

```js
// Shows the curried version of the type annotation
// Each argument is applied one at a type.

// join :: String -> [String] -> String
const join = curry((what, xs) => xs.join(what));

// match :: Regex -> String -> [String]
const match = curry((reg, s) => s.match(reg));
```

### Parametricity
A function will act on all types in a uniform manner.

map :: [a] -> [a]

head :: [a] -> a

#### Type Signiture Search engine
Hoogle

https://hoogle.haskell.org/


