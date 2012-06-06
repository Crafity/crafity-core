/*jslint bitwise: true, unparam: true, maxerr: 50 */
/*globals exports:true, module, require, Exception*/
/*!
 * crafity.common
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Exception = require('./crafity.Exception');

/**
 * Initialize module
 */

var common = (exports = (module.exports = module.exports || {}));

/**
 * Module name.
 */

exports.fullname = 'crafity.common';

/**
 * Module version.
 */

exports.version = '0.0.1';

/**
 * Validate arguments
 * @param name The name of the argument
 * @param value The value of the argument
 * @param type The expected type (or types)
 * @param required Value can not be null or undefined
 */
common.arg = common.args = function (name, value, type, required) {
	"use strict";
	if (!name) { throw new Exception("No options are passed to validateArguments"); }

	var options = [];

	if (name && typeof name === 'string' && value) {
		options.push({
			name: name,
			value: value,
			type: type,
			required: required
		});
	} else if (name instanceof Array) {
		options = name;
	} else {
		options = Array.apply(null, arguments);
	}

	options.forEach(function (option) {
		var isEmpty = option.value === undefined
			|| option.value === null;

		if (option.required && isEmpty) {
			throw new Exception("Argument '" + option.name + "' is required but was '" +
				(option.value === null ? "null" : "undefined") + "'");
		}

		if (option.type && !isEmpty && typeof option.value === 'string'
			&& option.type !== String) {
			throw new Exception("Argument '" + option.name + "' must be of type '" +
				option.type + "' but was '" + typeof option.value + "'");
		}
		if (option.type && !isEmpty && typeof option.value !== 'string'
			&& !(option.value instanceof option.type)) {
			throw new Exception("Argument '" + option.name + "' must be of type '" +
				option.type + "' but was '" + typeof option.value + "'");
		}
	});
};
