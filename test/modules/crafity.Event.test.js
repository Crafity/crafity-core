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

var jstest = require('crafity-jstest').createContext("Crafity Events")
  , assert = jstest.assert
  , Event = require('../../lib/modules/crafity.Event');

/**
 * Run the tests
 */
jstest.run({
  "Check if crafity.Event is available": function () {
    assert.isDefined(Event, "Expected Event to be defined");
  },

  "Instantiate an Event": function () {
    var event = new Event();

    assert.isDefined(event, "Expected the new instance to be defined");
    assert.isFunction(event.subscribe, "Expected Event to have a subscribe function");
    assert.isFunction(event.unsubscribe, "Expected Event to have a unsubscribe function");
    assert.isFunction(event.raise, "Expected Event to have a raise function");
  },

  "Raise an Event without subscribers": function () {
    var event = new Event();
    event.raise();
  },

  "Raise an Event with one subscriber": function (context) {
    this.async(100);
    var event = new Event();
    var called = false;
    event.subscribe(function () {
      called = true;
      context.complete();
    });
    event.raise();

    this.onComplete(function () {
      assert.isTrue(called, "Subscriber is not called");
    });
  },

  "Raise an Event with two subscriber": function () {
    this.async(100);

    var event = new Event();
    var called = 0;
    event.subscribe(function () {
      called += 1;
    });
    event.subscribe(function () {
      called += 1;
    });
    event.raise();

    this.onComplete(function (ex, result) {
      assert.areEqual(2, called, "Two subscribers are expected to be called");
    });
  },

  "Unsubscribe an existing subscriber": function () {
    var event = new Event("sync")
      , called = 0
      , handler = function () {
        called += 1;
      };
    event.subscribe(handler);
    event.raise();
    event.unsubscribe(handler);
    event.raise();

    assert.areEqual(1, called, "Expected the handler only to be called once");
  },

  "Unsubscribe an existing subscriber while the other subscribers are still called": function () {
    var event = new Event("sync")
      , handler1Called = 0, handler2Called = 0
      , handler = function () {
        handler1Called += 1;
      };
    event.subscribe(handler);
    event.subscribe(function () {
      handler2Called += 1;
    });
    event.raise();
    event.unsubscribe(handler);
    event.raise();

    assert.areEqual(1, handler1Called, "Expected the first handler only to be called once");
    assert.areEqual(2, handler2Called, "Expected the second handler to be called twice");

  },

  "Subscribe two subscriber where the first cancels the event": function () {
    var event = new Event('cancel', 'sync')
      , handler1Called = 0, handler2Called = 0, handler3Called = 0;
    event.subscribe(function () {
      handler1Called += 1;
    });
    event.subscribe(function () {
      handler2Called += 1;
      return false;
    });
    event.subscribe(function () {
      handler3Called += 1;
    });
    event.raise();
    event.raise();

    assert.areEqual(2, handler1Called, "Expected the first handler to be called twice");
    assert.areEqual(2, handler2Called, "Expected the second handler to be called twice");
    assert.areEqual(0, handler3Called, "Expected the third handler not to be called");
  },
});
