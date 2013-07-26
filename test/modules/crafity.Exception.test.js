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
var jstest = require('crafity-jstest').createContext("Crafity Exception")
  , assert = jstest.assert
  , Exception = require('../../lib/modules/crafity.Exception');

/**
 * Run the tests
 */
jstest.run({

  "Custom Exception": function () {
    function MyException() {
      return false;
    }

    var ex = Exception.custom(MyException, "Test");
    assert.areEqual("MyException", ex.constructor.name, "Expected another name");
    assert.areEqual("Test", ex.message, "Expected another name");
    assert.isTrue(ex instanceof MyException, "Expected to be an instanceof");
    assert.areEqual("MyException", ex.constructor.name, "Expected to be an instanceof");
  }
});
