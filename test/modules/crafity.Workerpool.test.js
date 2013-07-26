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

var jstest = require('crafity-jstest').createContext("Crafity Workerpool")
  , assert = jstest.assert
  , Workerpool = require('../../lib/modules/crafity.Workerpool');

/**
 * Run the tests
 */
jstest.run({

  "Add work to a new pool which must not execute": function (context) {
    context.async(1000);

    var pool = new Workerpool("Add work to a new pool which must not execute")
      , worked = 0
      , i;

    function incrementWorkCounter() {
      worked += 1;
    }

    for (i = 0; i < 100; i++) {
      pool.add(incrementWorkCounter);
    }
    pool.onWorkCompleted.subscribe(incrementWorkCounter);
    pool.onWorkItemCompleted.subscribe(incrementWorkCounter);
    context.onComplete(function (ex, result) {
      if (!ex) { return true; }
      if (ex.message === "Work item exceeded the specified time out") {
        assert.areEqual(0, worked, "Unexpected work is done");
        return false;
      }
      throw ex;
    });
  },

  "Add work to a new pool and execute": function (context) {
    context.async(3000);

    var pool = new Workerpool("Add work to a new pool and execute")
      , worked = 0
      , count = 50
      , i;

    function incrementWorkCounter() {
      worked += 1;
    }

    for (i = 0; i < count; i++) {
      pool.add(incrementWorkCounter);
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
    var pool = new Workerpool("Add more work to a new pool so it times out")
      , worked = 0
      , i;

    function incrementWorkCounter() {
      worked += 1;
      return worked;
    }

    for (i = 0; i < 100000; i++) {
      pool.add(incrementWorkCounter);
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

});
