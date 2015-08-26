
[![npm](https://img.shields.io/npm/v/scope-reporter.svg)](https://www.npmjs.com/package/scope-reporter)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/scope-reporter)
[![Build Status](https://secure.travis-ci.org/arlac77/scope-reporter.png)](http://travis-ci.org/arlac77/scope-reporter)
[![Coverage Status](https://coveralls.io/repos/arlac77/scope-reporter/badge.svg?branch=master&service=github)](https://coveralls.io/github/arlac77/scope-reporter?branch=master)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/scope-reporter.svg?style=flat-square)](https://github.com/arlac77/scope-reporter/issues)
[![Dependency Status](https://david-dm.org/arlac77/scope-reporter.svg)](https://david-dm.org/arlac77/scope-reporter)
[![devDependency Status](https://david-dm.org/arlac77/scope-reporter/dev-status.svg)](https://david-dm.org/arlac77/scope-reporter#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/scope-reporter.svg?branch=master)](http://inch-ci.org/github/arlac77/scope-reporter)

Scope Reporter
-------------------

Expands expressions in json objects

# example

## file.js

```js
var sc = require('scope-reporter');

const scopes = {
  'file': {
    properties: {
      name: {}
    },
    format: "file: ${name}"
  },
  'line': {
    properties: {
      line: {}
    },
    format: "line: ${line}"
  }
};

const sr = sc.createReporter(scopes);

sr.enterScope('file', 'theFileName');


sr.leaveScope( /* 'file' */);

```

Output

```

```

# install

With [npm](http://npmjs.org) do:

```
npm install scope-reporter
```

# license

BSD-2-Clause
