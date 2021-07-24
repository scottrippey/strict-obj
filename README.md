# strict-obj

A JavaScript object wrapper, that throws errors if you try to access not-defined properties.

# Installation
```sh
npm install strict-obj
```

# Usage
```js
import strictObj from 'strict-obj';

const data = strictObj({ one: "ONE", two: 2 });

// Access properties normally:
console.log(data.one, data.two) // "ONE 2"

// Errors are thrown for not-defined properties:
console.log(data.three) // Error: `three` is not defined

// Properties can be set normally:
data.three = "THREE";
console.log(data.three); // "THREE"

```
