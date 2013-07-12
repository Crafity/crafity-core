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

var jstest = require('crafity-jstest')
  , assert = jstest.assert
  , context = jstest.createContext()
  , Dictionary = require('../../lib/modules/crafity.Dictionary');

// Print out the name of the test module
console.log("Testing 'crafity.Dictionary.js'... ");

/**
 * The tests
 */
var tests = {
  "When a new Dictionary instance is created Then it must be an instance of type Dictionary": function () {
    // Arrange

    // Act
    var dictionary = new Dictionary();

    // Assert
    assert.hasValue(dictionary, "Expected a dictionary");
    assert.isInstanceOf(Dictionary, dictionary, "Expected a Dictionary");
    assert.isFalse(dictionary.hasAny, "Expected the hasAny property to be false");
    assert.areEqual(0, dictionary.count, "Expected no items in the dictionary");
  },

  "When a new Dictionary is created with initial data Then the initial data must be available": function () {
    // Arrange
    var initialData = { key1: "value1", key2: "value2" };

    // Act
    var dictionary = new Dictionary(initialData);

    // Assert
    assert.hasValue(dictionary, "Expected a dictionary");
    assert.isTrue(dictionary.hasAny, "Expected the hasAny property to be true");
    assert.areEqual(2, dictionary.count, "Expected items in the dictionary");
    assert.areEqual('value1', dictionary.get('key1'), "Expected the get function to return another value");
  },

  "When a new Dictionary is created with initial data Then the toObject must return the same data": function () {
    // Arrange
    var initialData = { key1: "value1", key2: "value2" }
      , dictionary = new Dictionary(initialData);

    // Act
    var result = dictionary.toObject();

    // Assert
    assert.hasValue(result, "Expected a result");
    assert.areEqual(initialData, result, "Expected another result");
  }
};

/**
 * Run the tests
 */
context.run(tests);
