/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, stupid: true */
"use strict";

/*!
 * crafity-core - Crafity core helper library
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Test dependencies.
 */

var jstest = require('crafity-jstest').createContext("Crafity Objects")
  , assert = jstest.assert
  , objects = require('../../lib/modules/crafity.objects');

/**
 * Run the tests
 */
jstest.run({

  "Compare two objects": function () {

    assert.isTrue(objects.areEqual(undefined, undefined), "Expected the objects to be the same. (undefined, undefined)");
    assert.isTrue(objects.areEqual(null, null), "Expected the objects to be the same. (null, null)");
    assert.isTrue(objects.areEqual(1, 1), "Expected the objects to be the same. (1, 1)");
    assert.isFalse(objects.areEqual(1, 0), "Expected the objects not to be the same. (1, 0)");
    assert.isFalse(objects.areEqual(0, 1), "Expected the objects not to be the same. (0, 1)");
    assert.isTrue(objects.areEqual("1", "1"), 'Expected the objects to be the same. ("1", "1")');
    assert.isFalse(objects.areEqual(1, "1"), 'Expected the objects not to be the same. (1, "1")');
    assert.isFalse(objects.areEqual("1", 1), 'Expected the objects not to be the same. ("1", 1)');
    assert.isFalse(objects.areEqual("1", 1), 'Expected the objects not to be the same. ("1", 1)');
    assert.isFalse(objects.areEqual(undefined, function () {
      return false;
    }), "Expected the objects not to be the same. (undefined, function () {})");
    assert.isFalse(objects.areEqual(function () {
      return false;
    }, undefined), "Expected the objects not to be the same. (function () {}, undefined)");
    assert.isTrue(objects.areEqual(function () {
      return false;
    }, function () {
      return false;
    }), "Expected the objects to be the same. (function () {}, function () {})");
    assert.isTrue(objects.areEqual({}, {}), "Expected the objects to be the same. ({}, {})");
    assert.isFalse(objects.areEqual(null, { "test": 123 }), 'Expected the objects to be the same. (null, { "test": 123 })');
    assert.isFalse(objects.areEqual({ "test": 123 }, null), 'Expected the objects to be the same. ({ "test": 123 }, null)');
    assert.isTrue(objects.areEqual({ "test": 123 }, { "test": 123 }), 'Expected the objects to be the same. ({ "test": 123 }, { "test": 123 })');
    assert.isFalse(objects.areEqual({ "test": 123 }, {}), 'Expected the objects not to be the same. ({ "test": 123 }, {})');

  }

});
