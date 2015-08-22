/* jslint node: true, esnext: true */

"use strict";

const expander = require('expression-expander');
const util = require('util');

const rootScope = {
  toString() {
      return this.name;
    },
    toJSON() {
      return {
        name: this.name,
        properties: this.properties
      };
    }
};

/**
 * creates several scope definition from a given json hash.
 */
exports.createScopeDefinitions = function (scopes) {
  const createdScopes = [];

  for (let s in scopes) {
    const scope = scopes[s];
    createdScopes.push(exports.createScopeDefinition(s, scope.properties, scope.format));
  }

  return createdScopes;
};

/**
 * creates a scope definition
 */
exports.createScopeDefinition = function (name, properties, format) {
  return Object.create(rootScope, {
    name: {
      value: name
    },
    properties: {
      value: properties
    },
    format: {
      value: format
    }
  });
};

exports.createReporter = function (scopeDefinitionsRaw) {

  const scopeDefinitions = {};

  const scopeStack = [];

  if(!util.isArray(scopeDefinitionsRaw)) {
    scopeDefinitionsRaw = exports.createScopeDefinitions(scopeDefinitionsRaw);
  }

  scopeDefinitionsRaw.forEach(function(s) { scopeDefinitions[s.name] = s; });

  const root = {
    /**
     * Enter a new scope by pushing the scope to the scope stack.
     *
     */
    enterScope(scope, properties) {
        scopeStack.push(Object.create(scopeDefinitions[scope], {
          values: {
            value: properties
          }
        }));
      },

      /**
       * leaves the last entered scope
       */
      leaveScope() {
        return scopeStack.pop();
      }
  };

  return Object.create(root, {
    scopeDefinitions : {
      value: scopeDefinitions
    },
    scopeStack: {
      value: scopeStack
    },
    currentScope: {
      get: function () {
        return scopeStack[scopeStack.length - 1];
      }
    }
  });
};
