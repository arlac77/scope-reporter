/* jslint node: true, esnext: true */

"use strict";

const expander = require('expression-expander');

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
 * creates several scope definition from a givens json hash.
 */
exports.createScopeDefinitions = function(scopes) {
  const createdScopes = [];

  for(let s in scopes) {
    const scope = scopes[s];
    createdScopes.push(exports.createScopeDefinition(s,scope.properties,scope.format));
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

exports.createReporter = function () {

  const scopeStack = [];

  const root = {
    /**
     * Enter a new scope by pushing the scope to the scope stack.
     *
     */
    enterScope(scope,properties) {
      scopeStack.push(scope);
      },

      /**
       * leaves the last entered scope
       */
      leaveScope() {
        return scopeStack.pop();
      }
  };

  return Object.create(root, {
    scopeStack: { value: scopeStack }
  });
};
