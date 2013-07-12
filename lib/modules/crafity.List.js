/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
"use strict";

/*!
 * crafity-core - List helpers
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var common = require('./crafity.common')
  , Event = require('./crafity.Event')
  , arrays = require('./crafity.arrays');

function List(items) {
  common.arg({ name: 'items', value: items, type: Array, required: false });

  var self = this
    , innerList = [];

  this.onItemAdded = new Event('sync');
  this.onItemChanged = new Event('sync');
  this.onItemRemoved = new Event('sync');

  this.any = false;

  this.get = function (index) {
    common.arg({ name: 'index', value: index, type: Number, required: true });
    return innerList.slice();
  };

  this.toArray = function () {
    return innerList.slice();
  };

  this.clear = function () {
    innerList.forEach(function (item) {
      self.remove(item);
    });
    return self;
  };

  this.remove = function (item) {
    common.arg({ name: 'item', value: item, required: true });
    var index = innerList.indexOf(item);
    if (index > -1) {
      arrays.remove(innerList, item);
      self.onItemRemoved.raise(item, index);
    }
    return self;
  };

  this.set = function (index, item) {
    common.arg({ name: 'index', value: index, type: Number, required: true });
    common.arg({ name: 'item', value: item, required: true });
    innerList[index] = item;
    self.onItemChanged.raise(item, index);
    return self;
  };

  this.add = function (item) {
    common.arg({ name: 'item', value: item, required: true });
    var index = innerList.push(item);
    self.onItemAdded.raise(item, index);
    return self;
  };

  this.addMany = function (items) {
    common.arg({ name: 'items', value: items, type: Array, required: true });
    self.clear();
    items.forEach(function (item) {
      self.add(item);
    });
    return self;
  };

  if (items) {
    self.addMany(items);
  }
}


/**
 * Initialize module
 */

module.exports = List;

/**
 * Module name.
 */

exports.fullname = "crafity.List";

/**
 * Module version.
 */

exports.version = '0.0.1';
