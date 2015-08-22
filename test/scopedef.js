/* global describe, it, xit */
/* jslint node: true, esnext: true */

"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const sc = require('../lib/scopeReporter.js');

describe('scope', function () {
  describe('create single', function () {
    it('attributes present', function () {
      const fileScopeDef = sc.createScopeDefinition('file', {
        'name': {}
      }, "file: ${name}");

      assert.equal(fileScopeDef.name, 'file');
      assert.equal(fileScopeDef.format, 'file: ${name}');
      assert.deepEqual(fileScopeDef.properties, {
        'name': {}
      });
    });
  });

  describe('create multiple', function () {
    const scopeDefs = sc.createScopeDefinitions({
      'file': {
        properties: {
          name: {}
        },
        format: "file: ${name}"
      },
      'line': {
        properties: {
          number: {}
        },
        format: "line: ${number}"
      }
    });
    it('present', function () {
      assert.lengthOf(scopeDefs, 2);
    });
  });
});
