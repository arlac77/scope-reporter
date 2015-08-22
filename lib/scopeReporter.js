/* jslint node: true, esnext: true */

"use strict";

const expander = require('expression-expander');
const util = require('util');

const rootScope = {
  toString() {
      return this.name;
    },
    toJSON() {
      const properties = {};
      for(let i in this.properties) {
        properties[i] = this.values[i];
      }
      return {
        name: this.name,
        properties: properties
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

const commonScopes = {
  'error' : { properties: { error: {} }, format: "${error}"},
  'exception' : { properties: { exception: {} }, format: "${exception}"}
};

exports.createReporter = function (scopeDefinitionsRaw) {

  const scopeDefinitions = {};

  const scopeStack = [];

  function addScopeDefs(defs) {
    if(!util.isArray(defs)) {
      defs = exports.createScopeDefinitions(defs);
    }

    defs.forEach(function(s) { scopeDefinitions[s.name] = s; });
  }

  addScopeDefs(commonScopes);
  addScopeDefs(scopeDefinitionsRaw);

  const root = {
    toString() {
      return scopeStack.map(function(s) { return `${s.name}: ${s.values}`; }).join(',');
    },
    /**
     * add additional scope definitions
     */
    addScopeDefinitions(defs) {
      addScopeDefs(defs);
    },
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
       * Leaves the last entered scope.
       * @param expectedScope the expected current scope may be undefined
       * @trows if expectedScope is not the current scope
       */
      leaveScope(expectedScope) {
        if(expectedScope !== undefined) {
            if(this.currentScope.name !== expectedScope) {
              throw(new Error(`Leaving scope: expected to be in ${expectedScope} but was in ${this.currentScope.name} scope`));
            }
        }

        return scopeStack.pop();
      },

      report(severity,message,scope,properties) {
        this.enterScope(scope,properties);
        //this.publish(severity,message);
        console.log(`${severity} ${message}`);
        this.leaveScope();
      },

      error(message,scope,properties) {
        this.report('error',message,scope,properties);
      },
      warn(message,scope,properties) {
        this.report('warn',message,scope,properties);
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
