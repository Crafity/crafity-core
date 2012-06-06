/*global module*/
/*!
 * crafity.Synchronizer - Synchronize multiple events
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

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

/**
 *
 * @param onfinish
 */

module.exports = function Synchronizer(finish) {
	var self = this
		, finished = false
		, lastError = null
		, onfinishCalled = false
		, handlerCount = 0
		, data = {}
		, onfinish
		, registerCalled = false
		, id = Math.random() * 100000;
	
	this.register = function () {
		registerCalled = true;
		if (onfinishCalled) {
			throw new Error("Can not register after onfinish is called");
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
			};
		}

		handlerCount += 1;

		return function ondone(err) {
			var args = Array.prototype.slice.call(arguments, 1), index, subData = data;

			for (index = 0; index < keys.length; index += 1) {
				if (index === keys.length - 1) {
					subData[keys[index]] = args[0];
				} else if (!subData[keys[index]]) {
					subData[keys[index]] = {};
				}
				subData = subData[keys[index]];
			}

			if (finished) {
				// Do nothing
			} else if (err) {
				finished = true;
				lastError = err;
				if (onfinish) {
					onfinishCalled = true;
					onfinish.call(onfinish, err);
				}
			} else {
				try {
					callback.apply(callback, arguments);
				} catch (err) {
					if (finished) { return; }
					finished = true;
					lastError = err;
					if (onfinish) {
						onfinishCalled = true;
						onfinish.call(onfinish, err);
					}
				}
				handlerCount -= 1;
				if (handlerCount === 0 && !finished) {
					finished = true;
					if (onfinish) {
						onfinishCalled = true;
						onfinish.call(onfinish, lastError, data);
					}
				}
			}
		};
	};

	this.onfinish = function (finish) {
		if (onfinish) {
			throw new Error("Already subscribed to the onfinish event");
		} else {
			onfinish = finish;
		}
		if (onfinishCalled) {
			throw new Error("On finish is already been called");
		}
		if (lastError) {
			onfinish(lastError, null);
		} else if (finished && !handlerCount) {
			onfinish(null, data);
		}
		if (!registerCalled) {
			onfinish(null, data);
		}
	};

	if (finish) {
		self.onfinish(finish);
	}
};

module.exports.Synchronizer = module.exports;
