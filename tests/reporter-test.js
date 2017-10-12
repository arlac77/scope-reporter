import { createReporter } from '../src/scope-reporter';
import test from 'ava';

const scopes = {
  file: {
    properties: {
      name: {}
    },
    format: 'file: ${name}'
  },
  line: {
    parent: 'file',
    properties: {
      number: {}
    },
    format: '${file.name}/${number}'
  },
  function: {
    properties: {
      name: {}
    },
    format: 'function: ${name}'
  }
};

test('reporter create scope stack empty', t => {
  const reporter = createReporter(scopes);
  t.is(reporter.scopeStack.length, 0);
  t.is(reporter.currentScope, undefined);
});

test('reporter common scope definitions present', t => {
  const reporter = createReporter(scopes);
  t.is(reporter.scopeDefinitions.error.name, 'error');
  t.is(reporter.scopeDefinitions.exception.name, 'exception');
});

test('reporter common scope definitions file present', t => {
  const reporter = createReporter(scopes);
  t.is(reporter.scopeDefinitions.file.name, 'file');
});

test('reporter add scope definitions', t => {
  const reporter = createReporter(scopes);

  reporter.addScopeDefinitions({
    newScope: {
      properties: {
        newScopeProp: {}
      },
      format: ''
    }
  });
  t.is(reporter.scopeDefinitions.newScope.name, 'newScope');
});

test('reporter enter/leave scopes', t => {
  const reporter = createReporter(scopes);

  const newScope = reporter.enterScope('file', 'aFile');
  t.is(reporter.currentScope, newScope);
  t.is(reporter.scopeStack.length, 1);
  t.is(reporter.currentScope.values.name, 'aFile');
  t.is(reporter.scope('file'), reporter.currentScope);
});

test('reporter enter scope', t => {
  const reporter = createReporter(scopes);

  const newScope = reporter.enterScope('file', 'aFile');
  t.is(reporter.currentScope, newScope);
  t.is(reporter.scopeStack.length, 1);
  t.is(reporter.currentScope.values.name, 'aFile');
  t.is(reporter.scope('file'), reporter.currentScope);

  const oldScope = reporter.leaveScope();
  t.is(reporter.scopeStack.length, 0);
  t.is(reporter.currentScope, undefined);
  t.is(oldScope.name, 'file');
});

test('reporter clear scope', t => {
  const reporter = createReporter(scopes);
  const newScope = reporter.enterScope('file', 'aFile');
  reporter.clearScopes();
  t.is(reporter.scopeStack.length, 0);
  t.is(reporter.currentScope, undefined);
});

test('reporter find scopes', t => {
  const reporter = createReporter(scopes);
  reporter.enterScope('file', 'aFile');

  t.is(reporter.scope('file').name, 'file');

  t.is(reporter.scope('no_present'), undefined);
});

test('reporter enter/leave scopes guarded', t => {
  const reporter = createReporter(scopes);
  reporter.enterScope('file', {
    name: 'aFile'
  });
  reporter.leaveScope('file');
  t.is(reporter.scopeStack.length, 0);
  t.is(reporter.currentScope, undefined);
});

test('reporter enter/leave scopes guarded - leave wrong scope should throw', t => {
  const reporter = createReporter(scopes);
  reporter.enterScope('file', {
    name: 'aFile'
  });
  try {
    reporter.leaveScope('other');
    t.is(reporter.scopeStack.length, 1);
  } catch (e) {
    t.is(
      e.message,
      'Leaving scope: expected to be in other but was in file scope'
    );
  }
});

test('reporter enter/leave scopes guarded - toString toJSON', t => {
  const reporter = createReporter(scopes);
  reporter.enterScope('file', 'aFile');
  reporter.enterScope('error', 'something went wrong');
  //assert.include(reporter.toString(), 'aFile');
  //console.log(JSON.stringify(reporter.toJSON()));

  t.deepEqual(reporter.toJSON(), {
    scopes: [
      {
        name: 'file',
        properties: {
          name: 'aFile'
        }
      },
      {
        name: 'error',
        properties: {
          error: 'something went wrong'
        }
      }
    ]
  });
});

/*
test('reporter enter/leave scopes guarded - set adapter late', t => {
  function reporterWithAssertions(severity) {
    const r = createReporter(scopes);
    r.adater = function(sr) {
      console.log('******** ');
    };
    return r;
  }

  const reporter = reporterWithAssertions('trace');
  reporter.trace('some error', 'file', 'aFile');
});



  describe('report', function() {
    describe('set adapter late', function() {
    });

    describe('console adaptor', function() {
      const myConsole = {
        log(message) {
          assert.include(message, 'some error');
          assert.include(message, 'aFile');
        }
      };

      function reporterWithAssertions(severity) {
        return sc.createReporter(scopes, sc.createConsoleAdapter(myConsole));
      }

      it('trace', function() {
        const reporter = reporterWithAssertions('trace');
        reporter.trace('some error', 'file', 'aFile');
      });
    });

    describe('logging adaptor', function() {
      function reporterWithAssertions(severity) {
        function myAsserter(severity) {
          return function(message) {
            assert.include(message, 'some error');
            assert.include(message, 'aFile');
          };
        }

        const logger = {
          trace: myAsserter('trace'),
          debug: myAsserter('debug'),
          info: myAsserter('info'),
          warn: myAsserter('warn'),
          error: myAsserter('error'),
          fatal: myAsserter('fatal')
        };
        return sc.createReporter(scopes, sc.createLoggingAdapter(logger));
      }

      it('trace', function() {
        const reporter = reporterWithAssertions('trace');
        reporter.trace('some error', 'file', 'aFile');
      });
      it('debug', function() {
        const reporter = reporterWithAssertions('debug');
        reporter.debug('some error', 'file', 'aFile');
      });
      it('info', function() {
        const reporter = reporterWithAssertions('info');
        reporter.info('some error', 'file', 'aFile');
      });
      it('warn', function() {
        const reporter = reporterWithAssertions('warn');
        reporter.warn('some error', 'file', 'aFile');
      });
      it('error', function() {
        const reporter = reporterWithAssertions('error');
        reporter.error('some error', 'file', 'aFile');
      });
      it('fatal', function() {
        const reporter = reporterWithAssertions('fatal');
        reporter.fatal('some error', 'file', 'aFile');
      });
    });

    describe('logging adaptor without fatal', function() {
      function reporterWithAssertions(severity) {
        function myAsserter(severity) {
          return function(message) {
            assert.include(message, 'some error');
            assert.include(message, 'aFile');
          };
        }

        const logger = {
          trace: myAsserter('trace'),
          debug: myAsserter('debug'),
          info: myAsserter('info'),
          warn: myAsserter('warn'),
          error: myAsserter('error')
        };
        return sc.createReporter(scopes, sc.createLoggingAdapter(logger));
      }

      it('fatal', function() {
        const reporter = reporterWithAssertions('fatal');
        reporter.fatal('some error', 'file', 'aFile');
      });
    });

    describe('internal model', function() {
      function reporterWithAssertions(severity) {
        return sc.createReporter(scopes, function(reporter) {
          assert.lengthOf(reporter.scopeStack, 2);
          assert.equal(reporter.scope('severity').values.severity, severity);
          assert.equal(reporter.scope('severity').values.message, 'some error');
          assert.equal(reporter.scope('file').values.name, 'aFile');
        });
      }

      if (
        (
          'exception',
          function() {
            const reporter = reporterWithAssertions('exception');
            reporter.enterScope('file', 'aFile');
            reporter.exception(new Error('some exception'));
          }
        )
      );

      it('trace', function() {
        const reporter = reporterWithAssertions('trace');
        reporter.trace('some error', 'file', 'aFile');
      });

      it('debug', function() {
        const reporter = reporterWithAssertions('debug');
        reporter.debug('some error', 'file', 'aFile');
      });

      it('info', function() {
        const reporter = reporterWithAssertions('info');
        reporter.info('some error', 'file', 'aFile');
      });

      it('warn', function() {
        const reporter = reporterWithAssertions('warn');
        reporter.warn('some error', 'file', 'aFile');
      });

      it('error', function() {
        const reporter = reporterWithAssertions('error');
        reporter.error('some error', 'file', 'aFile');
      });

      it('fatal', function() {
        const reporter = reporterWithAssertions('fatal');
        reporter.fatal('some error', 'file', 'aFile');
      });
    });
  });
});

*/
