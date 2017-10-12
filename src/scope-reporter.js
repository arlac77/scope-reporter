import { expander } from 'expression-expander';
const util = require('util');

const rootScopeDefinition = {
  toString() {
    return this.name;
  },
  toJSON() {
    const properties = {};
    for (const i in this.properties) {
      properties[i] = this.values[i];
    }
    return {
      name: this.name,
      properties: properties
    };
  },
  valueString() {
    const values = this.values;
    return Object.keys(values)
      .map(function(key) {
        return values[key];
      })
      .join(' ');
  },

  values: {}
};

/**
 * Creates several scope definition from a given json hash.
 * @param scopes
 */
export function createScopeDefinitions(scopes) {
  const createdScopes = [];

  for (const s in scopes) {
    const scope = scopes[s];
    createdScopes.push(
      createScopeDefinition(s, scope.properties, scope.format)
    );
  }

  return createdScopes;
}

/**
 * Creates a scope definition
 * @param name the scope definition name
 * @param properties describung properties for the scope
 * @param format format string for the scope properties
 */
export function createScopeDefinition(name, properties, format) {
  return Object.create(rootScopeDefinition, {
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
}

/**
 * Commonly used scopes
 */
const commonScopes = {
  /* used for general error handling */
  error: {
    properties: {
      error: {
        type: 'string'
      }
    },
    format: '${error}'
  },
  exception: {
    /* used for exceptions */
    properties: {
      exception: {
        type: 'Error'
      }
    },
    format: '${exception}'
  },
  severity: {
    /* used for logging entries */
    properties: {
      severity: {
        type: 'string'
      },
      message: {
        type: 'string'
      }
    },
    format: '${message}'
  }
};

/**
 * Creates a reporting adaptor for console api.
 * @param aConsole console object may be undefined for the default console
 * @return the newly created adaptor
 */
export function createConsoleAdapter(aConsole = console) {
  return function(reporter) {
    const message = reporter.scopeStack
      .map(scope => `${scope.name}: ${scope.valueString()}`)
      .join(',');
    aConsole.log(message);
  };
}

/**
 * Creates a reporting adaptor for logging api.
 * @param logger target logger
 * @return the newly created adaptor
 */
export function createLoggingAdapter(logger) {
  return function loggerReport(reporter) {
    const message = reporter.scopeStack
      .map(scope => `${scope.name}: ${scope.valueString()}`)
      .join(',');

    const ss = reporter.scope('severity');

    switch (ss.values.severity) {
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
        if (logger.fatal) {
          logger.fatal(message);
        }
        break;
      default:
        logger.error(message);
        break;
    }
  };
}

export function nullAdapter() {}

/**
 * Creates a new scope reporter.
 * @param scopeDefinitions
 * @param reportAdapter
 * @return {ScopeReporter} newly created scope reporter
 */
export function createReporter(
  scopeDefinitionsRaw,
  reportAdapter = createConsoleAdapter()
) {
  const scopeDefinitions = {};
  const scopeStack = [];

  function addScopeDefs(defs) {
    if (!util.isArray(defs)) {
      defs = createScopeDefinitions(defs);
    }

    defs.forEach(s => (scopeDefinitions[s.name] = s));
  }

  addScopeDefs(commonScopes);

  if (scopeDefinitionsRaw) {
    addScopeDefs(scopeDefinitionsRaw);
  }

  const root = {
    toString() {
      return scopeStack
        .map(scope => `${scope.name}: ${scope.valueString()}`)
        .join(',');
    },
    /**
       * Delivers the json representation of the scope-reporter.
       * @return object with scopes array
       */
    toJSON() {
      return {
        scopes: scopeStack.map(s => s.toJSON())
      };
    },

    /**
       * Add additional scope definitions
       * @param defs new scope defintions to be added to the already present ones
       */
    addScopeDefinitions(defs) {
      addScopeDefs(defs);
    },

    /**
       * Deliver a scope for a given scope name.
       * @param name {string} name of the scope
       * @return {object} for the given name
       */
    scope(name) {
      for (const s of scopeStack) {
        if (s.name === name) return s;
      }
      return undefined;
    },

    /**
       * Enter a new scope by pushing the scope to the scope stack.
       * @param scope name of the scope to be entered
       * @param propertiesOrScalar the properties of the new scope may ge a scalar if there is only one possible property
       * @return newly created scope with the assigned properties.
       */
    enterScope(scope, propertiesOrScalar) {
      const sd = scopeDefinitions[scope];

      if (
        typeof propertiesOrScalar === 'string' ||
        propertiesOrScalar instanceof String
      ) {
        const keys = Object.keys(sd.properties);
        if (keys.length === 1) {
          const scalar = propertiesOrScalar;
          propertiesOrScalar = {};
          propertiesOrScalar[keys[0]] = scalar;
        }
      }

      const newScope = Object.create(sd, {
        values: {
          value: propertiesOrScalar
        }
      });

      scopeStack.push(newScope);

      return newScope;
    },

    /**
       * Leaves the last entered scope.
       * @param expectedScope the expected current scope may be undefined
       * @throws if expectedScope is not the current scope
       * @return the old leaved scope
       */
    leaveScope(expectedScope) {
      if (expectedScope !== undefined) {
        if (this.currentScope.name !== expectedScope) {
          throw new Error(
            `Leaving scope: expected to be in ${expectedScope} but was in ${this
              .currentScope.name} scope`
          );
        }
      }

      return scopeStack.pop();
    },

    /**
       * Clears the scope stack
       */
    clearScopes() {
      while (scopeStack.length) {
        scopeStack.pop();
      }
    },

    reportWithSeverity(severity, message, scope, properties) {
      if (scope !== undefined) {
        this.enterScope(scope, properties);
      }

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
    },
    exception(e) {
      this.reportWithSeverity('fatal', undefined, 'exception', {
        exception: e
      });
    }
  };

  return Object.create(root, {
    /**
     * Delivers the scope definitions
     * @return scope defintions
     */
    scopeDefinitions: {
      value: scopeDefinitions
    },

    /**
     * Delivers the scope stack.
     * @return scope stack
     */
    scopeStack: {
      value: scopeStack
    },

    /**
     * Delivers the current scope
     * @return the current scope
     */
    currentScope: {
      get() {
        return scopeStack[scopeStack.length - 1];
      }
    },

    adapter: {
      get() {
        return reportAdapter;
      },
      set(ra) {
        reportAdapter = ra;
      }
    }
  });
}
