/* global describe, it, xit, console */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  sc = require('../dist/scope-reporter.js');

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

describe('reporter', function() {
  describe('create', function() {
    const reporter = sc.createReporter(scopes);

    it('scope stack empty', function() {
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });

    it('common scope definitions present', function() {
      assert.equal(reporter.scopeDefinitions.error.name, 'error');
      assert.equal(reporter.scopeDefinitions.exception.name, 'exception');
    });

    it('scope definitions present', function() {
      assert.equal(reporter.scopeDefinitions.file.name, 'file');
    });
  });

  describe('add scope definitions', function() {
    const reporter = sc.createReporter(scopes);

    it('scope definitions present', function() {
      reporter.addScopeDefinitions({
        newScope: {
          properties: {
            newScopeProp: {}
          },
          format: ''
        }
      });
      assert.equal(reporter.scopeDefinitions.newScope.name, 'newScope');
    });
  });

  describe('enter/leave scopes', function() {
    const reporter = sc.createReporter(scopes);

    it('default undefined scope', function() {
      assert.isUndefined(reporter.currentScope);
    });

    it('enter scope single scalar', function() {
      const reporter = sc.createReporter(scopes);
      const newScope = reporter.enterScope('file', 'aFile');
      assert.equal(reporter.currentScope, newScope);
      assert.lengthOf(reporter.scopeStack, 1);
      assert.equal(reporter.currentScope.values.name, 'aFile');
      assert.equal(reporter.scope('file'), reporter.currentScope);
    });

    it('enter scope', function() {
      const newScope = reporter.enterScope('file', {
        name: 'aFile'
      });
      assert.equal(reporter.currentScope, newScope);
      assert.lengthOf(reporter.scopeStack, 1);
      assert.equal(reporter.currentScope.values.name, 'aFile');
      assert.equal(reporter.scope('file'), reporter.currentScope);
    });

    it('leave scope again', function() {
      const oldScope = reporter.leaveScope();
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
      assert.equal(oldScope.name, 'file');
    });

    it('clear scope', function() {
      const reporter = sc.createReporter(scopes);
      const newScope = reporter.enterScope('file', 'aFile');
      reporter.clearScopes();
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });
  });

  describe('find scopes', function() {
    const reporter = sc.createReporter(scopes);
    reporter.enterScope('file', 'aFile');

    it('with name', function() {
      assert.equal(reporter.scope('file').name, 'file');
    });

    it('with invalid name', function() {
      assert.isUndefined(reporter.scope('no_present'));
    });
  });

  describe('enter/leave scopes guarded', function() {
    it('leave scope again', function() {
      const reporter = sc.createReporter(scopes);
      reporter.enterScope('file', {
        name: 'aFile'
      });
      reporter.leaveScope('file');
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });

    it('leave wrong scope should throw', function() {
      const reporter = sc.createReporter(scopes);
      reporter.enterScope('file', {
        name: 'aFile'
      });
      try {
        reporter.leaveScope('other');
        assert.lengthOf(reporter.scopeStack, 1);
      } catch (e) {
        assert.equal(
          e,
          'Error: Leaving scope: expected to be in other but was in file scope'
        );
      }
    });
  });

  describe('toString toJSON', function() {
    const reporter = sc.createReporter(scopes);
    reporter.enterScope('file', 'aFile');
    reporter.enterScope('error', 'something went wrong');
    assert.include(reporter.toString(), 'aFile');

    //console.log(JSON.stringify(reporter.toJSON()));

    assert.deepEqual(reporter.toJSON(), {
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

  describe('report', function() {
    describe('set adapter late', function() {
      function reporterWithAssertions(severity) {
        const r = sc.createReporter(scopes);
        r.adater = function(sr) {
          console.log('******** ');
        };
        return r;
      }

      it('trace', function() {
        const reporter = reporterWithAssertions('trace');
        reporter.trace('some error', 'file', 'aFile');
      });
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
