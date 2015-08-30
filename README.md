
[![npm](https://img.shields.io/npm/v/scope-reporter.svg)](https://www.npmjs.com/package/scope-reporter)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/scope-reporter)
[![Build Status](https://secure.travis-ci.org/arlac77/scope-reporter.png)](http://travis-ci.org/arlac77/scope-reporter)
[![Coverage Status](https://coveralls.io/repos/arlac77/scope-reporter/badge.svg?branch=master&service=github)](https://coveralls.io/github/arlac77/scope-reporter?branch=master)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/scope-reporter.svg?style=flat-square)](https://github.com/arlac77/scope-reporter/issues)
[![Dependency Status](https://david-dm.org/arlac77/scope-reporter.svg)](https://david-dm.org/arlac77/scope-reporter)
[![devDependency Status](https://david-dm.org/arlac77/scope-reporter/dev-status.svg)](https://david-dm.org/arlac77/scope-reporter#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/scope-reporter.svg?branch=master)](http://inch-ci.org/github/arlac77/scope-reporter)

Scope Reporter
--------------

Keeps trac of scope identifiers during processing.
Can be used for better logging/reporting.
The position (path to) of the issue/event is agregated while the
control flow reachs the point of the occurence.


# example

## file.js

```js
var sc = require('scope-reporter');

const scopes = {
  'file': {
    properties: {
      name: { type: "string" }
    },
    format: "file: ${name}"
  },
  'line': {
    properties: {
      line: { type: "number" }
    },
    format: "line: ${line}"
  }
};

const sr = sc.createReporter(scopes);

sr.enterScope('file', 'theFileName');  // enter the file scope

sr.enterScope('line', 1); // file & line scope


sr.leaveScope( /* 'line' */);
sr.leaveScope( /* 'file' */); // leave the file scope again

```

Output

```

```

jsdoc can be found [here](http://arlac77.github.io/modules/scope-reporter/doc/).

# install

With [npm](http://npmjs.org) do:

```
npm install scope-reporter
```

# license

BSD-2-Clause
