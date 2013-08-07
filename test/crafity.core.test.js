/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, stupid: true */
/*globals window*/
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

var jstest = require('crafity-jstest').createContext("Crafity Core Context")
  , assert = jstest.assert
  , core = require('../lib/crafity.core');

/**
 * Run the tests
 */

jstest.run({

  "Get the current modules script by calling getScript": function () {
    var typeofWindow = typeof window;
    if (typeofWindow !== 'undefined') { return; }
    core.getScript(function (err, script) {
      assert.isFalse(script && script.length === 0, "Expected a script to be loaded");
    });
    jstest.getScript(function (err, script) {
      assert.isFalse(script && script.length === 0, "Expected a script to be loaded");
    });
  }

});

module.exports = jstest;
