[![npm](https://img.shields.io/npm/v/scope-reporter.svg)](https://www.npmjs.com/package/scope-reporter)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/scope-reporter)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/scope-reporter)
[![Build Status](https://secure.travis-ci.org/arlac77/scope-reporter.png)](http://travis-ci.org/arlac77/scope-reporter)
[![bithound](https://www.bithound.io/github/arlac77/scope-reporter/badges/score.svg)](https://www.bithound.io/github/arlac77/scope-reporter)
[![codecov.io](http://codecov.io/github/arlac77/scope-reporter/coverage.svg?branch=master)](http://codecov.io/github/arlac77/scope-reporter?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/scope-reporter/badge.svg)](https://coveralls.io/r/arlac77/scope-reporter)
[![Code Climate](https://codeclimate.com/github/arlac77/scope-reporter/badges/gpa.svg)](https://codeclimate.com/github/arlac77/scope-reporter)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/scope-reporter/badge.svg)](https://snyk.io/test/github/arlac77/scope-reporter)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/scope-reporter.svg?style=flat-square)](https://github.com/arlac77/scope-reporter/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/scope-reporter.svg?label=ready&title=Ready)](http://waffle.io/arlac77/scope-reporter)
[![Dependency Status](https://david-dm.org/arlac77/scope-reporter.svg)](https://david-dm.org/arlac77/scope-reporter)
[![devDependency Status](https://david-dm.org/arlac77/scope-reporter/dev-status.svg)](https://david-dm.org/arlac77/scope-reporter#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/scope-reporter.svg?branch=master)](http://inch-ci.org/github/arlac77/scope-reporter)
[![downloads](http://img.shields.io/npm/dm/scope-reporter.svg?style=flat-square)](https://npmjs.org/package/scope-reporter)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

scope-reporter
=====
traks scope identifiers during processing

# API Reference

* <a name="createScopeDefinitions"></a>

## createScopeDefinitions(scopes)
Creates several scope definition from a given json hash.

**Kind**: global function  

| Param |
| --- |
| scopes | 


* <a name="createScopeDefinition"></a>

## createScopeDefinition(name, properties, format)
Creates a scope definition

**Kind**: global function  

| Param | Description |
| --- | --- |
| name | the scope definition name |
| properties | describung properties for the scope |
| format | format string for the scope properties |


* <a name="createConsoleAdapter"></a>

## createConsoleAdapter(aConsole) ⇒
Creates a reporting adaptor for console api.

**Kind**: global function  
**Returns**: the newly created adaptor  

| Param | Description |
| --- | --- |
| aConsole | console object may be undefined for the default console |


* <a name="createLoggingAdapter"></a>

## createLoggingAdapter(logger) ⇒
Creates a reporting adaptor for logging api.

**Kind**: global function  
**Returns**: the newly created adaptor  

| Param | Description |
| --- | --- |
| logger | target logger |


* <a name="createReporter"></a>

## createReporter(scopeDefinitions, reportAdapter) ⇒ <code>ScopeReporter</code>
Creates a new scope reporter.

**Kind**: global function  
**Returns**: <code>ScopeReporter</code> - newly created scope reporter  

| Param |
| --- |
| scopeDefinitions | 
| reportAdapter | 


* <a name="createReporter..root.toJSON"></a>

## createReporter~root.toJSON() ⇒
Delivers the json representation of the scope-reporter.

**Kind**: static method of <code>createReporter~root</code>  
**Returns**: object with scopes array  

* <a name="createReporter..root.addScopeDefinitions"></a>

## createReporter~root.addScopeDefinitions(defs)
Add additional scope definitions

**Kind**: static method of <code>createReporter~root</code>  

| Param | Description |
| --- | --- |
| defs | new scope defintions to be added to the already present ones |


* <a name="createReporter..root.scope"></a>

## createReporter~root.scope(name) ⇒ <code>object</code>
Deliver a scope for a given scope name.

**Kind**: static method of <code>createReporter~root</code>  
**Returns**: <code>object</code> - for the given name  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the scope |


* <a name="createReporter..root.enterScope"></a>

## createReporter~root.enterScope(scope, propertiesOrScalar) ⇒
Enter a new scope by pushing the scope to the scope stack.

**Kind**: static method of <code>createReporter~root</code>  
**Returns**: newly created scope with the assigned properties.  

| Param | Description |
| --- | --- |
| scope | name of the scope to be entered |
| propertiesOrScalar | the properties of the new scope may ge a scalar if there is only one possible property |


* <a name="createReporter..root.leaveScope"></a>

## createReporter~root.leaveScope(expectedScope) ⇒
Leaves the last entered scope.

**Kind**: static method of <code>createReporter~root</code>  
**Returns**: the old leaved scope  
**Throws**:

- if expectedScope is not the current scope


| Param | Description |
| --- | --- |
| expectedScope | the expected current scope may be undefined |


* <a name="createReporter..root.clearScopes"></a>

## createReporter~root.clearScopes()
Clears the scope stack

**Kind**: static method of <code>createReporter~root</code>  

* * *


install
=======

With [npm](http://npmjs.org) do:

```
npm install scope-reporter
```

license
=======

BSD-2-Clause
