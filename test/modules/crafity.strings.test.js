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
  , strings = require('../../lib/modules/crafity.strings');

// Print out the name of the test module
console.log("Testing 'crafity.strings.js'... ");

/**
 * The tests
 */
var tests = {

};

/**
 * Run the tests
 */
context.run(tests);
