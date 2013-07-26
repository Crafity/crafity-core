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

var jstest = require('crafity-jstest').createContext("Crafity Common")
  , assert = jstest.assert
  , common = require('../../lib/modules/crafity.common');

/**
 * Run the tests
 */
jstest.run({
  "Validate common.arg": function () {

    common.arg({ name: "arg1", value: undefined });
    common.arg({ name: "arg2", value: undefined, type: Array });
    common.arg({ name: "arg3", value: undefined, type: Array, required: false });
    common.arg({ name: "arg4", value: function Test() {
      return;
    }, type: Function, required: true });
    common.arg({ name: "arg5", value: "function Test() {}", type: String, required: true });

  }

});
