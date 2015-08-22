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
      for (let i in this.properties) {
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
  'error': {
    properties: {
      error: {}
    },
    format: "${error}"
  },
  'exception': {
    properties: {
      exception: {}
    },
    format: "${exception}"
  },
  'severity': {
    properties: {
      severity: {},
      message: {}
    },
    format: "${message}"
  }
};

function consoleAdapter(reporter)
{
  console.log(reporter);
}

exports.createLoggingAdapter = function (logger) {
  return function loggerReport(reporter) {
    const ss = reporter.scope('severity');
    const message = ss.property[message];
    switch (ss.severity) {
      case 'trace':
        logger.trace(message);
        break;
      case 'debug':
        logger.debug(message);
        break;
      case 'info':
        logger.info(message);
        break;
      case 'warn':
        logger.warn(message);
        break;
      case 'fatal':
        logger.fatal(message);
        break;
      default:
        logger.error(message);
        break;
    }
  };
};


exports.createReporter = function (scopeDefinitionsRaw, reportAdapter) {

  if(!reportAdapter) reportAdapter = consoleAdapter;

  const scopeDefinitions = {};

  const scopeStack = [];

  function addScopeDefs(defs) {
    if (!util.isArray(defs)) {
      defs = exports.createScopeDefinitions(defs);
    }

    defs.forEach(function (s) {
      scopeDefinitions[s.name] = s;
    });
  }

  addScopeDefs(commonScopes);
  addScopeDefs(scopeDefinitionsRaw);

  const root = {
    toString() {
        return scopeStack.map(function (s) {
          return `${s.name}: ${s.values}`;
        }).join(',');
      },
      /**
       * add additional scope definitions
       */
      addScopeDefinitions(defs) {
        addScopeDefs(defs);
      },

      scope(name) {
        for (let s of scopeStack) {
          if (s.name === name) return s;
        }
        return undefined;
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
        if (expectedScope !== undefined) {
          if (this.currentScope.name !== expectedScope) {
            throw (new Error(
              `Leaving scope: expected to be in ${expectedScope} but was in ${this.currentScope.name} scope`));
          }
        }

        return scopeStack.pop();
      },

      reportWithSeverity(severity, message, scope, properties) {
        this.enterScope(scope, properties);
        this.enterScope('severity', {
          severity: severity,
          message: message
        });
        reportAdapter(this);
        this.leaveScope('severity');
        this.leaveScope(scope);
      },

      trace(message, scope, properties) {
        this.reportWithSeverity('trace', message, scope, properties);
      },
      debug(message, scope, properties) {
        this.reportWithSeverity('debug', message, scope, properties);
      },
      info(message, scope, properties) {
        this.reportWithSeverity('info', message, scope, properties);
      },
      warn(message, scope, properties) {
        this.reportWithSeverity('warn', message, scope, properties);
      },
      error(message, scope, properties) {
        this.reportWithSeverity('error', message, scope, properties);
      },
      fatal(message, scope, properties) {
        this.reportWithSeverity('fatal', message, scope, properties);
      }
  };

  return Object.create(root, {
    scopeDefinitions: {
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
