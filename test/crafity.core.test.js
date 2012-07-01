/*!
 * crafity.core.test - Core tests
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Test dependencies.
 */
var jstest = require('crafity-jstest')
	, context = jstest.createContext()
	, core = require('../lib/crafity.core');

// Print out the name of the test module
console.log("Testing 'crafity.core.js'... ");

/**
 * The tests
 */

var tests = {

	"Get the current modules script by calling getScript": function () {
		if (typeof window !== 'undefined') { return; }
		core.getScript(function (err, script) {
			var min = script.replace(/\t/gmi, ''); //.replace(/\ /gmi, ''); //.replace(/\n/gmi,'');
			//console.log(err, min, script.length, min.length);
		});
		jstest.getScript(function (err, script) {
			var min = script.replace(/\t/gmi, ''); //.replace(/\ /gmi, ''); //.replace(/\n/gmi,'');
			//console.log(err, min, script.length, min.length);
		});
	}

};

/**
 * Run the tests
 */

context.run(tests);

require("./modules/crafity.Dictionary.test.js");
require("./modules/crafity.Event.test.js");
require("./modules/crafity.Exception.test.js");
require("./modules/crafity.List.test.js");
require("./modules/crafity.Workerpool.test.js");
require("./modules/crafity.common.test.js");
require("./modules/crafity.objects.test.js");
require("./modules/crafity.strings.test.js");
