/*jslint bitwise: true, unparam: true, maxerr: 50, white: true */
/*globals exports:true, module, require, process */
/*!
 * crafity.core
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var arrays = require('./modules/crafity.arrays.js')
	, common = require('./modules/crafity.common.js')
	, Dictionary = require('./modules/crafity.Dictionary.js')
	, Exception = require('./modules/crafity.Exception.js')
	, Event = require('./modules/crafity.Event.js')
	, filesystem = require('fs')
	, List = require('./modules/crafity.List.js')
	, objects = require('./modules/crafity.objects.js')
	, strings = require('./modules/crafity.strings.js')
	, Workerpool = require('./modules/crafity.Workerpool.js')
	, query = require('./modules/crafity.query.js')
	, Synchronizer = require('./modules/crafity.Synchronizer.js');

/**
 * Initialize module
 */

module.exports = objects.extend({}, common); 

/**
 * Environment
 */

module.exports.env = process.env.NODE_ENV || 'dev';

/**
 * Module name.
 */

module.exports.fullname = "crafity-core";

/**
 * Module version.
 */

module.exports.version = '0.1.6';

/**
 *
 */

module.exports.strings = strings;

/**
 *
 */

module.exports.objects = objects;

/**
 *
 */

module.exports.arrays = arrays;

/**
 *
 */

module.exports.Event = Event;


/**
 *
 */

module.exports.Exception = Exception;

/**
 *
 */

module.exports.List = List;

/**
 *
 */

module.exports.query = query;

/**
 *
 */

module.exports.Workerpool = Workerpool;

/**
 * 
 */

module.exports.Dictionary = Dictionary;

/**
 *
 */

module.exports.Synchronizer = Synchronizer;

/**
 * 
 */

if (module.filename) {

	module.exports.modules = {
		getScript: function (current, callback) {
			"use strict";
			current = current || module;
			if (!current || !current.filename) {
				throw new Error("This is not a module");
			}
			filesystem.readFile(current.filename, function (err, buffer) {
				callback(err, buffer.toString());
			});
		}
	};
	module.exports.getScript = function (callback) {
		"use strict";
		module.exports.modules.getScript(module, callback);
	};
}
