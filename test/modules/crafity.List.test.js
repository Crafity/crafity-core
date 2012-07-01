/*!
 * crafity.strings.test - List tests
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Test dependencies.
 */
var jstest = require('crafity-jstest')
	, assert = jstest.assert
	, context = jstest.createContext()
	, List = require('../../lib/modules/crafity.List');

// Print out the name of the test module
console.log("Testing 'crafity.List.js'... ");

/**
 * The tests
 */
var tests = {

	"Instaniate a new list": function() {
		var list = new List();
		assert.areEqual("List", list.constructor.name, "Expected another type of list");
		assert.areEqual(0, list.toArray().length, "Expected no items to be in the list");
	},

	"Instaniate a new list with data": function() {
		var list = new List([1, 2, 3]);
		assert.areEqual(3, list.toArray().length, "Expected items to be in the list");
	},

	"Setting a bunch of items": function() {
		this.async(10);
		var list = new List()
			, onItemAddedCount = 0;

		assert.areEqual(0, list.toArray().length, "Expected no items to be in the list");
		
		list.onItemAdded.subscribe(function (err, item) {
			onItemAddedCount += 1;
		});

		assert.areEqual(list, list.addMany([1, 2, 3]), "Expected the list to be returned");

		this.onComplete(function (err, result) {
			assert.areEqual(3, list.toArray().length, "Expected no items to be in the list");
			assert.areEqual(3, onItemAddedCount, "Expected 3 onItemAdded events");
		});
	}

};

/**
 * Run the tests
 */
context.run(tests);
