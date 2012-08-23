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

exports = (module.exports = module.exports || {});

var core = objects.extend(module.exports, common);

/**
 * Environment
 */

core.env = process.env.NODE_ENV || 'dev';

/**
 * Module name.
 */

exports.fullname = "crafity-core";

/**
 * Module version.
 */

exports.version = '0.0.9';

/**
 *
 */

core.strings = strings;

/**
 *
 */

core.objects = objects;

/**
 *
 */

core.arrays = arrays;

/**
 *
 */

core.Event = Event;


/**
 *
 */

core.Exception = Exception;

/**
 *
 */

core.List = List;

/**
 *
 */

core.query = query;

/**
 *
 */

core.Workerpool = Workerpool;

/**
 * 
 */

core.Dictionary = Dictionary;

/**
 *
 */

core.Synchronizer = Synchronizer;

/**
 * 
 */

if (module.filename) {

	core.modules = {
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
	core.getScript = function (callback) {
		"use strict";
		core.modules.getScript(module, callback);
	};
}
