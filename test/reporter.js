/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const sc = require('../lib/scopeReporter.js');


const scopes = {
  'file' : { properties: { name : {} }, format: "file: ${name}" },
  'line' : { parent: 'file', properties: { number : {} }, format: "${file.name}/${number}" },
  'function' : { properties: { name: {} }, format: "function: ${name}"}
};

describe('reporter', function () {
  describe('create', function () {
    const reporter = sc.createReporter(scopes);

    it('scope stack empty', function () {
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });
  });

  describe('enter/leave scopes', function () {
    const reporter = sc.createReporter(scopes);

    it('enter scope', function () {
      reporter.enterScope('file', { name: 'aFile'});
      assert.lengthOf(reporter.scopeStack, 1);
      assert.equal(reporter.currentScope.values.name, 'aFile');
    });

    it('leave scope again', function () {
      reporter.leaveScope();
      assert.lengthOf(reporter.scopeStack, 0);
      assert.isUndefined(reporter.currentScope);
    });
  });

});
