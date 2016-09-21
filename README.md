# normalise case

A simple, recursive transform of strings or keys of objects.

Supports looking through nested objects and through arrays.

## Usage

```javascript
var normaliseCase = require('normalise-case');

var objectToNormalise = {
    UpperCamelCase: [
        { SomeKey: 1 },
    ],
};

var normalised = normaliseCase(objectToNormalise);

normalised.upperCamelCase[0].someKey === 1;
```
