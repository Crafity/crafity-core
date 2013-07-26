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

var jstest = require('crafity-jstest').createContext("Crafity List")
  , assert = jstest.assert
  , List = require('../../lib/modules/crafity.List');

/**
 * Run the tests
 */
jstest.run({

  "Instaniate a new list": function () {
    var list = new List();
    assert.areEqual("List", list.constructor.name, "Expected another type of list");
    assert.areEqual(0, list.toArray().length, "Expected no items to be in the list");
  },

  "Instaniate a new list with data": function () {
    var list = new List([1, 2, 3]);
    assert.areEqual(3, list.toArray().length, "Expected items to be in the list");
  },

  "Setting a bunch of items": function () {
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

});
