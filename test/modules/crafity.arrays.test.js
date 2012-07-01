/*!
 * crafity.arrays.test - Arrays tests
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
	, arrays = require('../../lib/modules/crafity.arrays');

// Print out the name of the test module
console.log("Testing 'crafity.arrays.js'... ");

/**
 * The tests
 */
var tests = {
	"Validate array.add": function () {
		var numberArray = [1, 2, 3];

		assert.areEqual([1, 2, 3, 4], arrays.add(numberArray, 4),
			"Expected an array of [1, 2, 3, 4]");
		
		assert.areEqual([1, 2, 3, 4, 5], arrays.add(numberArray, 5),
			"Expected an array of [1, 2, 3, 4, 5]");
	},

	"Validate array.contains": function () {
		var numberArray = [1, 2, 3, 4];

		assert.isFalse(arrays.contains(numberArray, 0), "Expected the number 0 not to be in the array");
		assert.isTrue(arrays.contains(numberArray, 1), "Expected the number 1 to be in the array");
		assert.isTrue(arrays.contains(numberArray, 2), "Expected the number 2 to be in the array");
		assert.isTrue(arrays.contains(numberArray, 3), "Expected the number 3 to be in the array");
		assert.isTrue(arrays.contains(numberArray, 4), "Expected the number 4 to be in the array");
		assert.isFalse(arrays.contains(numberArray, 5), "Expected the number 5 not to be in the array");
	},
	"Validate array.contains.not": function () {
		var numberArray = [1, 2, 3, 4];

		assert.isTrue(arrays.contains.not(numberArray, 0), "Expected the number 0 not to be in the array");
		assert.isFalse(arrays.contains.not(numberArray, 1), "Expected the number 1 to be in the array");
		assert.isFalse(arrays.contains.not(numberArray, 2), "Expected the number 2 to be in the array");
		assert.isFalse(arrays.contains.not(numberArray, 3), "Expected the number 3 to be in the array");
		assert.isFalse(arrays.contains.not(numberArray, 4), "Expected the number 4 to be in the array");
		assert.isTrue(arrays.contains.not(numberArray, 5), "Expected the number 5 not to be in the array");
	}
};

/**
 * Run the tests
 */
context.run(tests);
