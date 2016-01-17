
[![npm](https://img.shields.io/npm/v/scope-reporter.svg)](https://www.npmjs.com/package/scope-reporter)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/scope-reporter)
[![Build Status](https://secure.travis-ci.org/arlac77/scope-reporter.png)](http://travis-ci.org/arlac77/scope-reporter)
[![bithound](https://www.bithound.io/github/arlac77/scope-reporter/badges/score.svg)](https://www.bithound.io/github/arlac77/scope-reporter)
[![codecov.io](http://codecov.io/github/arlac77/scope-reporter/coverage.svg?branch=master)](http://codecov.io/github/arlac77/scope-reporter?branch=master)
[![Test Coverage](https://codeclimate.com/github/arlac77/scope-reporter/badges/coverage.svg)](https://codeclimate.com/github/arlac77/scope-reporter/coverage)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/scope-reporter.svg?style=flat-square)](https://github.com/arlac77/scope-reporter/issues)
[![Dependency Status](https://david-dm.org/arlac77/scope-reporter.svg)](https://david-dm.org/arlac77/scope-reporter)
[![devDependency Status](https://david-dm.org/arlac77/scope-reporter/dev-status.svg)](https://david-dm.org/arlac77/scope-reporter#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/scope-reporter.svg?branch=master)](http://inch-ci.org/github/arlac77/scope-reporter)
[![downloads](http://img.shields.io/npm/dm/scope-reporter?style=flat-square)](https://npmjs.org/package/scope-reporter)

Scope Reporter
--------------

Keeps track of scope identifiers during processing.
Can be used for better logging/reporting.
The position (path to) of the issue/event is aggregated while the
control flow reaches the point of the occurence.


# example

## file.js

```javascript
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

```shell
npm install scope-reporter
```

# license

BSD-2-Clause
