/*jslint bitwise: true, unparam: true, maxerr: 50 */
/*globals exports:true, module, require*/
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

var common = require('./crafity.common');

/**
 * Initialize module
 */

var arrays = (exports = (module.exports = module.exports || {}));

/**
 * Framework version.
 */

exports.version = '0.0.1';

/**
 * Convert an object into an array
 * @param obj The object to convert
 * @returns The object as an array
 */

arrays.toArray = function (obj) {
	"use strict";
	common.arg({ name: 'obj', value: obj, required: true });
//return Array.prototype.slice.call(obj, 0);
	return Array.apply(null, obj);
};

/**
 * Add an object to an array
 * @param array The array to add to
 * @param obj The object to add
 * @returns The array
 */

arrays.add = function (array, obj) {
	"use strict";
	common.arg({ name: 'array', value: array, required: true, type: Array });
	array.push(obj);
	return array;
};

/**
 * Check if an object is in an array
 * @param array
 * @param obj
 * @returns a boolean value
 */
arrays.contains = function (array, obj) {
	"use strict";
	common.arg({ name: 'array', value: array, required: true, type: Array });
	return !!~array.indexOf(obj);
};

/**
 * Check if an array does not contain an object
 * @param array The array
 * @param obj The object
 * @return a boolean value
 */
arrays.contains.not = function (array, obj) {
	"use strict";
	return !arrays.contains.apply(this, arrays.toArray(arguments));
};

/**
 * Return an array, containing the common members of both input arrays.
 * Example arrays.intersect([1,2,3], [3,4,5]) returns [3]
 * @returns an array
 */
arrays.intersect = function() {
	if (!arguments.length)
		return [];
	var a1 = arguments[0];
	var a2 = null;
	var a = [];
	var n = 1;
	while (n < arguments.length) {
		a2 = arguments[n];
		var l = a1.length;
		var l2 = a2.length;
		for (var i = 0; i < l; i++) {
			for (var j = 0; j < l2; j++) {
				if (a1[i] === a2[j] && !~a.indexOf(a1[i]))
					a.push(a1[i]);
			}
		}
		n++;
	}
	return a;
};

/**
 * Group values in an array.
 * @param {Array} array The array to group
 * @param {Function} fn (optional) A grouping function
 * @return {Object} A object with grouped key/values  
 * 
 * @example A Simple group by example: groupBy([1, 2, 3, 2, 4, 4, 3, 5]). 
 * Result:  { '1': [ 1 ],'2': [ 2, 2 ],'3': [ 3, 3 ],'4': [ 4, 4 ],'5': [ 5 ] }
 * 
 * @example A simple group by and return length example: groupBy([1, 2, 3, 2, 4, 4, 3, 5], 
 * 							function (array) {
 * 								return array.length;
 *							}));
 * Result: { '1': 1, '2': 2, '3': 2, '4': 2, '5': 1 }
 * 
 * @example A simple group by and sum example: groupBy([1, 2, 3, 2, 4, 4, 3, 5], 
 * 						function (array) {
 * 							return array.reduce(function (seed, value) { return seed + value }, 0);
 *						}));
 * Result: { '1': 1, '2': 4, '3': 6, '4': 8, '5': 5 }	
 * 
 */
arrays.groupBy = function (array, fn) {
	var result = {};
	array.forEach(function (item) {
		result[item] = result[item] || [];
		result[item].push(item);
	});
	if (fn) {
		Object.keys(result).forEach(function (key) {
			result[key] = fn(result[key]);
		})
	}
	return result;
};
