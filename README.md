# strict-obj

A "Strict Object" behaves just like a JavaScript object, but throws errors when you try to access not-defined properties.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Usage with Jest](#usage-with-jest)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Installation
```sh
npm install strict-obj
```

# Usage
```js
import strictObject from 'strict-obj';

const data = strictObject({ one: "ONE", two: 2 });

// Access properties normally:
console.log(data.one, data.two) // "ONE 2"

// Errors are thrown for not-defined properties:
console.log(data.three) // Error: `three` is not defined

// Properties can be set normally:
data.three = "THREE";
console.log(data.three); // "THREE"
```

# API

`strictObject<T>(data: DeepPartial<T>, name?: string, config?: StrictObjectConfig): T`

- `data` - the data that will be wrapped.  Nested objects will be automatically wrapped too.  This can be any object, array, or function.
- `name` - (default: `"strictObject"`) improves the error message, eg. `ReferenceError: strictObject.prop is not defined`
- `config`
  - `ignore: Array<string | symbol>` (default `[]`) - an array of keys/symbols to ignore (they will return the raw value, or `undefined`)
  - `shallow` (default `false`) - ignores nested objects
  - `throwOnSet` (default `false`) - Normally, you can set any value on a Strict Object, even if not defined.  Setting this to `true` will ensure you can only set properties that are already defined, and an error will be thrown otherwise.

# Usage with Jest

When using a StrictObject with certain Jest features (like `expect` or Snapshots), Jest checks the objects for certain fields (like `asymmetricMatch`, `$$typeof`, `toJSON`, etc).  
You can automatically ignore these fields by importing from `strict-object/jest` like so:

```js
import strictObject from 'strict-object/jest';

it('should ignore jest-specific fields', () => {
  const data = strictObject({ one: 1 });
  expect(data).toMatchInlineSnapshot(`
    Object {
      "one": 1,
    }
  `);
});
```
