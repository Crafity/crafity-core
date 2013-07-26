/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true */
"use strict";

/*!
 * crafity-core - Synchronizer helpers
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */


var EventEmitter = require('events').EventEmitter;

/**
 * Initialize module
 */

/**
 * Module name.
 */

module.exports.fullname = 'crafity.Synchronizer';

/**
 * Module version.
 */

module.exports.version = '0.0.1';

function Synchronizer(finish) {
  var self = this
    , finished = false
    , lastError = null
    , onfinishCalled = false
    , handlerCount = 0
    , data = {}
    , registerCalled = false;

  this.register = function () {
    registerCalled = true;
    if (onfinishCalled) {
      throw new Error("Can not register new callbacks after onfinish is called");
    }
    finished = false;

    var callback, index, keys = [];
    for (index = 0; index < arguments.length; index += 1) {
      if (typeof arguments[index] === 'string') {
        keys.push(arguments[index]);
      } else if (index === arguments.length - 1
        && typeof arguments[index] === 'function') {
        callback = arguments[index];
      }
    }

    if (!callback) {
      callback = function () {
        return false;
      };
    }

    handlerCount += 1;

    return function ondone(err) {
      var args = Array.prototype.slice.call(arguments, 1), i, subData = data;

      for (i = 0; i < keys.length; i += 1) {
        if (i === keys.length - 1) {
          subData[keys[i]] = args[0];
        } else if (!subData[keys[i]]) {
          subData[keys[i]] = {};
        }
        subData = subData[keys[i]];
      }

      if (err) {
        finished = true;
        lastError = err;
        if (self.listeners("finished").length) {
          onfinishCalled = true;
          self.emit("finished", err);
        }
      } else if (!finished) {
        try {
          callback.apply(callback, arguments);
        } catch (callbackErr) {
          finished = true;
          lastError = callbackErr;
          if (self.listeners("finished").length) {
            onfinishCalled = true;
            self.emit("finished", callbackErr);
          }
        }
        handlerCount -= 1;
        if (handlerCount === 0 && !finished) {
          finished = true;
          if (self.listeners("finished").length) {
            onfinishCalled = true;
            self.emit("finished", lastError, data);
          }
        }
      }
      // Do nothing
    };
  };

  this.onfinish = function (finish) {
    self.on("finished", finish);

    if (lastError) {
      finish(lastError, null);
    } else if (finished && !handlerCount) {
      finish(null, data);
    }
    if (!registerCalled) {
      finish(null, data);
    }
  };

  if (finish) {
    self.onfinish(finish);
  }
}

Synchronizer.prototype = new EventEmitter();

module.exports = Synchronizer;
module.exports.Synchronizer = Synchronizer;
