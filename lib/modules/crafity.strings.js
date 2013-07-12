/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, ass: true */
"use strict";

/*!
 * crafity-core - Strings helpers
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

var strings = (module.exports = module.exports || {});

/**
 * Module name.
 */

exports.fullname = 'crafity.strings';

/**
 * Module version.
 */

exports.version = '0.0.1';

strings.trim = function (value) {
  return (value || this).replace(/^\s+|\s+$/g, "");
};

/**
 * Trim spaces on the left
 * @param value
 */

strings.ltrim = function (value) {
  return value.replace(/^\s+/, "");
};

/**
 * trim space from the right
 * @param value
 */

strings.rtrim = function (value) {
  return value.replace(/\s+$/, "");
};

/**
 * Apply character padding on the left
 * @param value
 * @param character
 * @param length
 */

strings.lpad = function (value, character, length) {
  while (value.length < length) {
    value = character + value;
  }
  return value;
};

/**
 * Apply character padding on the right
 * @param value
 * @param character
 * @param length
 */

strings.rpad = function (value, character, length) {
  while (value.length < length) {
    value = value + character;
  }
  return value;
};
