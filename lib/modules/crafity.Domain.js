/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
"use strict";

/*!
 * crafity-core - Domain helpers
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module name.
 */

exports.fullname = "crafity.Domain";

/**
 * Module version.
 */

exports.version = '0.0.1';

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , Domain
  ;

try {
  /* Try to get the default node Domain module and use it if possible */

  Domain = require('domain');

} catch (err) {

  /* So there is no default node Domain or some other error.
   * Let's create a dummy domain object and continue.
   */

  Domain = function Domain() {
    var self = this;

    /**
     * Run a function in a separate domain
     * @param {Function} fn The function to run
     */
    this.run = function (fn) {
      /* There is no domain, so let's use setTimeout (browser compatible) */
      setTimeout(function () {
        try {
          fn();
        } catch (err) {
          self.emit('error', err);
        }
      }, 0);
    };
  };
  /* Set the EventEmitter as prototype of the Domain */
  Domain.prototype = EventEmitter.prototype;

  /* Add a createDomain function */
  Domain.createDomain = function () {
    return new Domain();
  };
}

module.exports = Domain;
