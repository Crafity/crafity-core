/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, ass: true */
"use strict";

/*!
 * crafity-core - Objects helpers
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */


// none

/**
 * Initialize module
 */

var objects = (module.exports = module.exports || {});

/**
 * Framework version.
 */

exports.version = '0.0.1';

/**
 *
 * @param obj
 * @param fn
 */

objects.forEach = function forEach(obj, fn, thisp) {
  thisp = thisp || this;
  var member;

  if (typeof fn !== "function") {
    throw new TypeError();
  }
  for (member in obj) {
    if (obj.hasOwnProperty(member)) {
      fn.call(thisp, obj[member], member, obj);
    }
  }
};

/**
 *
 * @param obj
 * @param fn
 * @param thisp
 */

objects.map = function map(obj, fn, thisp) {
  thisp = thisp || this;
  var member, result = {};

  if (typeof fn !== "function") {
    throw new TypeError();
  }
  for (member in obj) {
    if (obj.hasOwnProperty(member)) {
      result[member] = fn.call(thisp, obj[member], member, obj);
    }
  }
  return result;
};

/**
 *
 * @param obj
 * @param extension
 */

objects.extend = function extend(obj, extension) {
  objects.forEach(extension, function (value, name) {
    obj[name] = extension[name];
  });
  return obj;
};

/**
 *
 * @param obj
 */

objects.clone = function clone(obj, shallow) {
  if (!shallow) {
    return JSON.parse(JSON.stringify(obj));
  }
  return objects.extend({}, obj);
};

/**
 *
 * @param obj1
 * @param obj2
 */
var valueTypes = ['string', 'number', 'array', 'date'];
objects.areEqual = function (obj1, obj2) {

  // False if not the same type
  var typeofObj1 = (typeof obj1)
    , typeofObj2 = (typeof obj2);
  
  if (typeofObj1 !== typeofObj2) { return false; }

  // if they are equal, they are equal
  if (obj1 === obj2) { return true; }

  // The following types had to be ===
  if (valueTypes.indexOf(typeofObj1) > -1) {
    return false;
  }

  // If one object === null, return false.
  //  problem with null is that it is an object
  if (obj1 === null || obj2 === null) {
    return false;
  }

  // If a function, compare as string
  if (obj1 instanceof Function) {
    return objects.areEqual(obj1.toString(), obj2.toString());
  }

  // Compare the left with the right and the right with the left
  //  The first check is if the right object has all the left properties
  //  Then the right object should not have more properties
  //  The content of the members must be the same
  var cache = [];

  objects.forEach(obj1, function (value, member) {
    cache.push(member);
  });

  objects.forEach(obj2, function (value, member) {
    var index = cache.indexOf(member);

    // If the member was not found in the cache, stop checking
    if (index === -1) { return false; }

    // Compare the content of the member
    if (!objects.areEqual(value, obj1[member])) {
      return false;
    }

    cache.splice(index, 1);
  });

  // The objects are equal when there is nothing left
  return !cache.length;
};

/**
 * Merge two JSON objects (right takes precedent)
 * @param {Object} obj1 First object
 * @param {Object} obj2 Second object
 */

objects.merge = function merge(obj1, obj2) {
  var newObj = {};

  function innerMerge(obj1, obj2) {
    if (!(obj2 instanceof Array) && typeof obj2 === 'object') {
      Object.keys(obj2).forEach(function (name) {
        if (!obj1 || typeof obj1 !== 'object') { obj1 = {}; }
        if (obj1[name] && obj2[name]) {
          obj1[name] = innerMerge(obj1[name], obj2[name]);
        } else {
          obj1[name] = obj2[name];
        }
      });
    } else if (typeof obj1 === 'object' && obj2 === undefined) {
      obj1 = undefined;
    } else {
      obj1 = obj2;
    }
    return obj1;
  }

  return innerMerge(innerMerge(newObj, obj1), obj2);
};

objects.fromArray = function (array) {
  var obj = {};
  array.forEach(function (item) {
    obj[item.toString()] = item;
  });
  return obj;
};

objects.createProperty = function (object, name, type, readonly) {
  readonly = readonly || false;
  return function (value) {
    if (!readonly && arguments.length > 0) {
      if (Boolean === type) {
        object[name] = !!value;
      } else {
        object[name] = value;
      }
    } else {
      if (Boolean === type) {
        return !!object[name];
      }
      return object[name];
    }
  };
};
