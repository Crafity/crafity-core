/*!
 * crafity.Exception.test - Exception tests
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Test dependencies.
 */
var jstest = require('crafity.jstest')
	, assert = jstest.assert
	, context = jstest.createContext()
	, Exception = require('../../lib/modules/crafity.Exception');

// Print out the name of the test module
console.log("Testing 'crafity.Exception.js'... ");

/**
 * The tests
 */
var tests = {

	"Custom Exception": function () {
		function MyException() {}
		var ex = Exception.custom(MyException, "Test");
		assert.areEqual("MyException", ex.constructor.name, "Expected another name");
		assert.areEqual("Test", ex.message, "Expected another name");
		assert.isTrue(ex instanceof MyException, "Expected to be an instanceof");
		assert.areEqual("MyException", ex.constructor.name, "Expected to be an instanceof");
	}
};

/**
 * Run the tests
 */
context.run(tests);
