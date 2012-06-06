/*jslint bitwise: true, unparam: true, maxerr: 50, white: true */
/*globals exports:true, module, require */
/*!
 * crafity.arrays
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

// none

/**
 * Initialize module
 */

var strings = (exports = (module.exports = module.exports || {}));

/**
 * Module name.
 */

exports.fullname = 'crafity.strings';

/**
 * Module version.
 */

exports.version = '0.0.1';

strings.trim = function(value) {
	"use strict";
	return (value || this).replace(/^\s+|\s+$/g, "");
};

/**
 * Trim spaces on the left
 * @param value
 */

strings.ltrim = function(value) {
	"use strict";
	return value.replace(/^\s+/, "");
};

/**
 * trim space from the right
 * @param value
 */

strings.rtrim = function(value) {
	"use strict";
	return value.replace(/\s+$/, "");
};

/**
 * Apply character padding on the left
 * @param value
 * @param character
 * @param length
 */

strings.lpad = function(value, character, length) {
	"use strict";
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

strings.rpad = function(value, character, length) {
	"use strict";
	while (value.length < length) {
		value = value + character;
	}
	return value;
};
