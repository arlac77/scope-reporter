/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const sc = require('../lib/scopeReporter.js');


const scopes = {
  'file': {
    properties: {
      name: {}
    },
    format: "file: ${name}"
  },
  'line': {
    parent: 'file',
    properties: {
      number: {}
    },
    format: "${file.name}/${number}"
  },
  'function': {
    properties: {
      name: {}
    },
    format: "function: ${name}"
  }
};

describe('reporter', function () {
  describe('create', function () {
    const reporter = sc.createReporter(scopes);

    it('scope stack empty', function () {
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });

    it('common scope definitions present', function () {
      assert.equal(reporter.scopeDefinitions.error.name, 'error');
      assert.equal(reporter.scopeDefinitions.exception.name, 'exception');
    });

    it('scope definitions present', function () {
      assert.equal(reporter.scopeDefinitions.file.name, 'file');
    });
  });

  describe('add scope definitions', function () {
    const reporter = sc.createReporter(scopes);

    it('scope definitions present', function () {
      reporter.addScopeDefinitions({
        'newScope': {
          properties: {
            "newScopeProp": {}
          },
          format: ""
        }
      });
      assert.equal(reporter.scopeDefinitions.newScope.name, 'newScope');
    });
  });

  describe('enter/leave scopes', function () {
    const reporter = sc.createReporter(scopes);

    it('enter scope', function () {
      reporter.enterScope('file', {
        name: 'aFile'
      });
      assert.lengthOf(reporter.scopeStack, 1);
      assert.equal(reporter.currentScope.values.name, 'aFile');
    });

    it('leave scope again', function () {
      reporter.leaveScope();
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });
  });

  describe('enter/leave scopes guarded', function () {
    it('leave scope again', function () {
      const reporter = sc.createReporter(scopes);
      reporter.enterScope('file', {
        name: 'aFile'
      });
      reporter.leaveScope('file');
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });

    it('leave wrong scope should throw', function () {
      const reporter = sc.createReporter(scopes);
      reporter.enterScope('file', {
        name: 'aFile'
      });
      try {
        reporter.leaveScope('other');
        assert.lengthOf(reporter.scopeStack, 1);
      } catch (e) {
        assert.equal(e,'Error: Leaving scope: expected to be in other but was in file scope');
      }
    });
  });

  describe('report', function () {
    it('leave scope again', function () {
      const reporter = sc.createReporter(scopes);
      reporter.error('some error', 'file', {
        name: 'File'
      });
    });
  });
});
