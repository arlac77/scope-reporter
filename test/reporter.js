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
  'line' : { properties: { number : {} }, format: "line: ${number}" }
};

describe('reporter', function () {
  describe('create', function () {
    it('scope stack empty', function () {
      const reporter = sc.createReporter(scopes);
      assert.lengthOf(reporter.scopeStack, 0);
    });
  });
});
