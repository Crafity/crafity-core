/*jslint bitwise: true, unparam: true, maxerr: 50, white: true */
/*globals exports:true, module, require, Exception*/
/*!
 * crafity.Event
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var objects = require('./crafity.objects');

/**
 * Initialize module
 */

exports = module.exports = Exception;

/**
 * Module name.
 */

exports.fullname = "crafity.Exception";

/**
 * Module version.
 */

exports.version = '0.0.1';

/**
 * A type representing an Exception
 * @param message The message for the exception
 * @param innerException The inner exception
 * @param constructor A constructor of an object to inherit from Exception
 */

function Exception(message, innerException) {
	"use strict";
	if (!message) {
		throw new Exception("Argument 'message' is required but was '" +
				(message === null ? "null" : "undefined") + "'");
	}
	if (typeof message !== 'string') {
		throw new Exception("Argument 'message' must be of type 'string' but was '" + typeof message + "'");
	}

	if (innerException === undefined && typeof message !== 'string') {
		innerException = message;
		message = innerException.message || innerException.toString();
	}

	this.message = message;
	this.innerException = innerException;
	this.toString = function () {
		return message;
	};
}


exports.custom = function (Constructor, message, innerException) {
	"use strict";
	if (!Constructor) {
		throw new Exception("Argument 'Constructor' is required but was '" +
				(Constructor === null ? "null" : "undefined") + "'");
	}
	if (!(Constructor instanceof Function)) {
		throw new Exception("Argument 'Constructor' must be of type 'Function' but was '" + typeof message + "'");
	}
	if (message && typeof message !== 'string') {
		throw new Exception("Argument 'message' must be of type 'string' but was '" + typeof message + "'");
	}
	var newException = new (Constructor)()
		, updatedException = objects.extend(new Exception(message, innerException), newException);
	objects.extend(newException, updatedException);

	return newException;
};
