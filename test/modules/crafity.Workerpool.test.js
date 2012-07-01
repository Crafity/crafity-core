/*!
 * crafity.strings.test - Strings tests
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
	, Workerpool = require('../../lib/modules/crafity.Workerpool');

// Print out the name of the test module
console.log("Testing 'crafity.Workerpool.js'... ");

/**
 * The tests
 */
var tests = {

	"Add work to a new pool which must not execute": function (context) {
		context.async(1000);

		var pool = new Workerpool("Add work to a new pool which must not execute");
		var worked = 0;

		for (var i = 0; i < 100; i++) {
			pool.add(function () {
				worked += 1;
			});
		}
		pool.onWorkCompleted.subscribe(function () {
			worked += 1;
		});
		pool.onWorkItemCompleted.subscribe(function () {
			worked += 1;
		});
		context.onComplete(function (ex, result) {
			if (ex.message === "Work item exceeded the specified time out") {
				assert.areEqual(0, worked, "Unexpected work is done");
				return false;
			} else {
				throw ex;
			}
		});
	},

	"Add work to a new pool and execute": function (context) {
		context.async(3000);

		var pool = new Workerpool("Add work to a new pool and execute");
		var worked = 0;

		var count = 50;
		for (var i = 0; i < count; i++) {
			pool.add(function () {
				worked += 1;
			});
		}
		pool.onWorkCompleted.subscribe(function () {
			context.complete();
		});

		pool.work();

		context.onComplete(function (ex, result) {
			pool.stop();
			if (ex) { throw ex; }
			assert.areEqual(count, worked, "Not the expected amount of work is done");
		});

	},

	"Add more work to a new pool so it times out": function (context) {
		context.async(2000);
		var pool = new Workerpool("Add more work to a new pool so it times out");
		var worked = 0;

		for (var i = 0; i < 100000; i++) {
			pool.add(function () {
				worked += 1;
			});
		}
		pool.onWorkCompleted.subscribe(function (ex, result) {
			context.complete(ex, result);
		});

		pool.work(1);

		context.onComplete(function (ex, result) {
			pool.stop();
			assert.hasValue(ex, "Expected a time out exception");
			assert.areEqual(ex.message, "Work item exceeded the specified time out", "Expected a time out exception");
			return false;
		});

	}

};

/**
 * Run the tests
 */
context.run(tests);
