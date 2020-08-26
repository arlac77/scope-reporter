[![npm](https://img.shields.io/npm/v/scope-reporter.svg)](https://www.npmjs.com/package/scope-reporter)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/scope-reporter)](https://bundlephobia.com/result?p=scope-reporter)
[![downloads](http://img.shields.io/npm/dm/scope-reporter.svg?style=flat-square)](https://npmjs.org/package/scope-reporter)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/scope-reporter.svg?style=flat-square)](https://github.com/arlac77/scope-reporter/issues)
[![Build Status](https://travis-ci.com/arlac77/scope-reporter.svg?branch=master)](https://travis-ci.com/arlac77/scope-reporter)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/scope-reporter.git)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/scope-reporter/badge.svg)](https://snyk.io/test/github/arlac77/scope-reporter)
[![Coverage Status](https://coveralls.io/repos/arlac77/scope-reporter/badge.svg)](https://coveralls.io/r/arlac77/scope-reporter)

# scope-reporter

traks scope identifiers during processing

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [createScopeDefinitions](#createscopedefinitions)
    -   [Parameters](#parameters)
-   [createScopeDefinition](#createscopedefinition)
    -   [Parameters](#parameters-1)
-   [commonScopes](#commonscopes)
-   [createConsoleAdapter](#createconsoleadapter)
    -   [Parameters](#parameters-2)
-   [createLoggingAdapter](#createloggingadapter)
    -   [Parameters](#parameters-3)
-   [createReporter](#createreporter)
    -   [Parameters](#parameters-4)
-   [rootObject](#rootobject)
    -   [toJSON](#tojson)
    -   [addScopeDefinitions](#addscopedefinitions)
        -   [Parameters](#parameters-5)
    -   [scope](#scope)
        -   [Parameters](#parameters-6)
    -   [enterScope](#enterscope)
        -   [Parameters](#parameters-7)
    -   [leaveScope](#leavescope)
        -   [Parameters](#parameters-8)
    -   [clearScopes](#clearscopes)
-   [scopeDefinitions](#scopedefinitions)
-   [scopeStack](#scopestack)
-   [currentScope](#currentscope)

## createScopeDefinitions

Creates several scope definition from a given json hash.

### Parameters

-   `scopes` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## createScopeDefinition

Creates a scope definition

### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** the scope definition name
-   `properties` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** describung properties for the scope
-   `format`  format string for the scope properties

## commonScopes

Commonly used scopes

## createConsoleAdapter

Creates a reporting adaptor for console api.

### Parameters

-   `aConsole` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** console object may be undefined for the default console (optional, default `console`)

Returns **any** the newly created adaptor

## createLoggingAdapter

Creates a reporting adaptor for logging api.

### Parameters

-   `logger`  target logger

Returns **any** the newly created adaptor

## createReporter

Creates a new scope reporter.

### Parameters

-   `scopeDefinitionsRaw` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `reportAdapter`   (optional, default `createConsoleAdapter()`)

Returns **ScopeReporter** newly created scope reporter

## rootObject

methods of all scopes

### toJSON

Delivers the json representation of the scope-reporter.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** with scopes array

### addScopeDefinitions

Add additional scope definitions

#### Parameters

-   `defs`  new scope defintions to be added to the already present ones

### scope

Deliver a scope for a given scope name.

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the scope

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** for the given name

### enterScope

Enter a new scope by pushing the scope to the scope stack.

#### Parameters

-   `scope`  name of the scope to be entered
-   `propertiesOrScalar`  the properties of the new scope may ge a scalar if there is only one possible property

Returns **any** newly created scope with the assigned properties.

### leaveScope

Leaves the last entered scope.

#### Parameters

-   `expectedScope`  the expected current scope may be undefined


-   Throws **any** if expectedScope is not the current scope

Returns **any** the old leaved scope

### clearScopes

Clears the scope stack

## scopeDefinitions

Delivers the scope definitions

Returns **any** scope defintions

## scopeStack

Delivers the scope stack.

Returns **any** scope stack

## currentScope

Delivers the current scope

Returns **any** the current scope

# install

With [npm](http://npmjs.org) do:

    npm install scope-reporter

# license

BSD-2-Clause
