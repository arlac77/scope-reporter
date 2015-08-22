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
    });
  });

  describe('enter leave scopes', function () {
    const reporter = sc.createReporter(scopes);

    it('can enter scope', function () {
      reporter.enterScope('file', { name: 'aFile'});
      assert.lengthOf(reporter.scopeStack, 1);
    });

    it('can leave scope', function () {
      reporter.leaveScope();
      assert.lengthOf(reporter.scopeStack, 0);
    });
  });

});
