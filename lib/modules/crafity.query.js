/**
 * User: Bart
 * Date: 4-dec-2010
 * Time: 0:24:40
 * Description: Crafity - Query Framework
 */

//noinspection BadExpressionStatementJS
"use strict";
/*global crafity, debug */

var crafity = module.exports;

crafity.getType = (function init() {
	var functioNameRegEx = /function (\w{1,})\(/;

	return function getTypeInternal(o) {
		if (o === undefined) {
			return "undefined";
		}
		if (o instanceof Array) {
			return "Array";
		} else {
			if (o === null) {
				return "Object";
			}
			var matches = o.constructor.toString().match(functioNameRegEx), type;
			if (matches !== undefined && matches !== null && matches.length === 2) {
				return matches[1];
			}
			type = (typeof o);
			if (type === "object") {
				matches = o.constructor.toString().match(/(?:\[object\s)?(\w+)\]/i);
				if (matches.length === 2) {
					type = matches[1];
				}
			}
			return type;
		}
	};
}());

crafity.ofType = function (value, types) {
	types = crafity.ensureArray(types);
	var type = crafity.getType(value);
	return (types.has(type));
};

crafity.defaultValue = function (value, defaultValue) {
	if (value === undefined || value === null) {
		return defaultValue;
	}
	return value;
};

crafity.hasValue = function (value) {
	if (value === undefined || value === null) {
		return false;
	}
	return true;
};

crafity.hasNoValue = function (value) {
	if (value === undefined || value === null) {
		return true;
	}
	return false;
};

crafity.loop = function (times, func) {
	var index;
	for (index = 0; index < times; index += 1) {
		func(index);
	}
};

/**
 * The Enumerator base class
 * @class Enumerator
 * @param {Function} getCurrent Function that retrieves the current value
 * @param {Function} moveNext Function that moves to the next item and returns true if there was a next item, otherwise false
 * @param {Function} reset Function that resets the enumerator to the beginning of the enumerable
 */
function Enumerator(getCurrent, moveNext, reset) {
	var index = 0,
		self = this;

	/**
	 * Get the current index of the enumerator
	 */
	this.getIndex = function getIndexEnumeratorInternal() {
		return index;
	};
	/**
	 * Function that retrieves the current value
	 * @function
	 * @returns {Object} The current item
	 */
	this.getCurrent = function getCurrentInternal() {
		return getCurrent(self);
	};

	this.overrideGetCurrent = function overrideGetCurrentInternal(getCurrent) {
		self.getCurrent = function () {
			return getCurrent(self.getCurrent());
		};
		return self;
	};
	/**
	 * Function that moves to the next item and returns true if there was a next item, otherwise false
	 * @function
	 * @returns {Boolean} True if moved to the next item, otherwise false
	 */
	this.moveNext = function moveNextInternal() {
		index = index + 1;
		return moveNext(self);
	};
	/**
	 * Function that moves to the next item and returns true if there was a next item, otherwise false
	 * @function
	 * @returns {Boolean} True if moved to the next item, otherwise false
	 */
	this.reset = function resetInternal() {
		index = 0;
		return reset(self);
	};
}
crafity.Enumerator = Enumerator;

/**
 * A dictionary of specific enumerator implementations
 */
Enumerator.enumeratorFactories = {};
/**
 * An enumerator implementation for an Array
 */
Enumerator.enumeratorFactories.Function = {
	getEnumerator: function getFunctionEnumeratorInternal(parent, func) {
		return (function () {
			var currentValue;
			return new crafity.Enumerator(
				function getcurrentInternal() {
					return self.getCurrent();
				},
				function moveNextInternal() {
					var returned = false;

					function yieldReturn(value) {
						currentValue = value;
						returned = true;
					}

					while (returned === false && self.moveNext()) {
						func(self.getCurrent(), yieldReturn);
					}
					return returned;
				},
				function resetInternal() {
					return self.reset();
				});
		}());
	}
};
/**
 * An enumerator implementation for an Array
 */
Enumerator.enumeratorFactories.Array = {
	getEnumerator: function getArrayEnumeratorInternal(parent, array) {
		return (function () {
			var startIndex = -1, index = startIndex;
			return new crafity.Enumerator(
				function getcurrentInternal(enumerator) {
					//debug.log("GetCurrent");
					return array[index];
				},
				function moveNextInternal(enumerator) {
					//debug.log("MoveNext");
					if (index >= array.length - 1) {
						return false;
					}
					index += 1;
					return index < array.length;
				},
				function resetInternal(enumerator) {
					index = startIndex;
				});
		}());
	}
};
/**
 * An enumerator implementation for an existing Enumerable
 */
Enumerator.enumeratorFactories.Enumerable = {
	getEnumerator: function getEnumerableEnumeratorInternal(parent, enumerable) {
		return enumerable.getEnumerator();
	}
};
/**
 * An enumerator implementation for an existing Enumerator
 */
Enumerator.enumeratorFactories.Enumerator = {
	getEnumerator: function getEnumeratorEnumeratorInternal(parent, enumerator) {
		return enumerator;
	}
};

/**
 * The Enumerable base class
 * @class Enumerable
 * @param {Array|Enumerable|Enumerator} object The enumerable source to wrap
 */
function Enumerable(object) {
	var self = this,
		enumeratorFactory = Enumerator.enumeratorFactories[crafity.getType(object)];

	if (enumeratorFactory === undefined) {
		throw ("There is no Enumerator for an object of type '" + crafity.getType(object) + "'");
	}

	/**
	 * An enumerable object
	 */
	this.getObject = function internalGetObject() {
		return object;
	};

	this.overrideEnumerator = function overrideEnumeratorInternal(getEnumerator) {
		self.getEnumerator = function getEnumeratorInternal() {
			return function () {
				return getEnumerator(self.getEnumerator());
			};
		};
		return self;
	};

	/**
	 * Returns a function that gets an enumerator
	 * @returns {Function} A function to get an enumerator
	 */
	this.getEnumerator = function getEnumeratorInternal() {
		return enumeratorFactory.getEnumerator(self, object);
	};

	/**
	 * Define a for each loop for an enumerable
	 * @param {Function} consumer A yield function
	 * @returns {Enumerable} A new enumerable containing the each logic
	 */
	this.forEach = function forEachInternal(consumer) {
		return crafity.Enumerable.from(consumer);
	};
	/**
	 * Selects or transforms an enumerable into a new enumerable
	 * @param {Function} func A function that selects a value from an item
	 * @returns {Enumerable} A new enumerable containing the select logic
	 */
	this.select = function selectInternal(func) {
		//	return self.forEach(
		//		function forEachItem(value, yieldReturn) {
		//			yieldReturn(func(value));
		//		}
		//		);

		//	return new Enumerable(this).overrideEnumerator(function(enumerator) {
		//		return enumerator.overrideGetCurrent(function (current) {
		//			return func(current);
		//		});
		//	});
		var innerEnumerator = self.getEnumerator();
		return new crafity.Enumerable(
			new crafity.Enumerator(
				function getCurrentInternal() {
					return func(innerEnumerator.getCurrent());
				},
				function moveNextInternal() {
					return innerEnumerator.moveNext();
				},
				function resetInternal() {
					return innerEnumerator.reset();
				}
			)
		);
	};
	this.union = function unionInternal(enumerable) {
		var innerEnumerator = self.getEnumerator(),
			otherEnumerable,
			otherEnumerator,
			switched = false;
		return new crafity.Enumerable(
			new crafity.Enumerator(
				function getCurrentInternal() {
					return switched === false ? innerEnumerator.getCurrent() : otherEnumerator.getCurrent();
				},
				function moveNextInternal() {
					var result = false;
					if (switched === false) {
						result = innerEnumerator.moveNext();
						if (result === false) {
							if (otherEnumerable === undefined) {
								otherEnumerable = new crafity.Enumerable(enumerable);
							}
							otherEnumerator = otherEnumerable.getEnumerator();
							result = otherEnumerator.moveNext();
							switched = true;
						}
					} else {
						result = otherEnumerator.moveNext();
					}

					return result;
				},
				function resetInternal() {
					switched = false;
					return innerEnumerator.reset();
				}
			)
		);
	};
	this.selectMany = function selectManyInternal(func) {
		var innerEnumerator = self.getEnumerator();
		var childEnumerable, childEnumerator;
		return new crafity.Enumerable(
			new crafity.Enumerator(
				function getCurrentInternal() {
					return childEnumerator.getCurrent();
				},
				function moveNextInternal() {
					var movedNext = false, finished = false;

					if (childEnumerator !== undefined) {
						movedNext = childEnumerator.moveNext();
					}

					while (movedNext === false && finished === false) {
						childEnumerator = undefined;
						childEnumerable = undefined;
						finished = innerEnumerator.moveNext() === false;
						if (finished === false) {
							var childValue = func(innerEnumerator.getCurrent());
							childEnumerable = new crafity.Enumerable(childValue);
							childEnumerator = childEnumerable.getEnumerator();
						}
						if (childEnumerator !== undefined) {
							movedNext = childEnumerator.moveNext();
						}
					}

					return movedNext
				},
				function resetInternal() {
					childEnumerator = undefined;
					childEnumerable = undefined;
					return innerEnumerator.reset();
				}
			)
		);
	};
	this.recursive = function recursiveInternal(func) {
		var innerEnumerator = self.getEnumerator();
		var childEnumerable, childEnumerator;
		return new crafity.Enumerable(
			new crafity.Enumerator(
				function getCurrentInternal() {
					if (crafity.hasValue(childEnumerator)) {
						return childEnumerator.getCurrent();
					} else {
						return innerEnumerator.getCurrent();
					}
				},
				function moveNextInternal() {
					var movedNext = false, finished = false;

					if (crafity.hasValue(childEnumerable) && crafity.hasNoValue(childEnumerator)) {
						childEnumerator = childEnumerable.getEnumerator();
					}

					if (crafity.hasValue(childEnumerator)) {
						movedNext = childEnumerator.moveNext();
					}

					if (movedNext === false && finished === false) {
						childEnumerator = undefined;
						childEnumerable = undefined;
						movedNext = innerEnumerator.moveNext();
						finished = !movedNext;
						if (finished === false) {
							var childValue = func(innerEnumerator.getCurrent());
							childEnumerable = new crafity.Enumerable(childValue).recursive(func);
						}
					}

					return movedNext
				},
				function resetInternal() {
					childEnumerator = undefined;
					childEnumerable = undefined;
					return innerEnumerator.reset();
				}
			)
		);
	};
	/**
	 * Where filters an enumerable by creating a new filtered enumerable
	 * @param {Function} func A function that decides if a value is included
	 * @returns {Enumerable} A new filtered enumerable
	 */
	this.where = function whereInternal(func) {
		var innerEnumerator = self.getEnumerator();
		return new crafity.Enumerable(
			new crafity.Enumerator(
				function getCurrentInternal() {
					return innerEnumerator.getCurrent();
				},
				function moveNextInternal() {
					var moveNext = innerEnumerator.moveNext();
					while (moveNext && !func(innerEnumerator.getCurrent())) {
						moveNext = innerEnumerator.moveNext();
					}
					return moveNext;
				},
				function resetInternal() {
					return innerEnumerator.reset();
				}
			)
		);
	};
	/**
	 * Take X number of items from the enumerable
	 * @param {Number} number Number of items to take
	 * @returns {Enumerable} A new enumerable containing the take logic
	 */
	this.take = function takeInternal(number) {
		var innerEnumerator = self.getEnumerator();
		return new crafity.Enumerable(
			new crafity.Enumerator(
				function getCurrentInternal() {
					return innerEnumerator.getCurrent();
				},
				function moveNextInternal() {
					return innerEnumerator.getIndex() < number && innerEnumerator.moveNext();
				},
				function resetInternal() {
					return innerEnumerator.reset();
				}
			)
		);
	};
	/**
	 * Skip X number of items in the enumerable
	 * @param number Number of items to skip
	 * @returns {Enumerable} A new enumerable containing the skip logic
	 */
	this.skip = function skipInternal(number) {
		var innerEnumerator = self.getEnumerator();
		return new crafity.Enumerable(
			new crafity.Enumerator(
				function getCurrentInternal() {
					return innerEnumerator.getCurrent();
				},
				function moveNextInternal() {
					while (innerEnumerator.getIndex() < number && innerEnumerator.moveNext()) {
					}
					return innerEnumerator.moveNext();
				},
				function resetInternal() {
					return innerEnumerator.reset();
				}
			)
		);
	};
	/**
	 * Loop thru all the items in an enumerable.
	 * @param {Function} func This function will be called for every item
	 */
	this.loop = function loopInternal(func) {
		var enumerator = self.getEnumerator();
		enumerator.reset();
		while (enumerator.moveNext()) {
			func(enumerator.getCurrent());
		}
	};
	/**
	 * Aggregate an enumerable with a custom function
	 * @param {Function} func A function containing the aggregagtion logic
	 * @param {Object} seed The initial value to start the aggregation with
	 * @returns {Object} The aggregated result
	 */
	this.aggregate = function aggregateInternal(func, seed) {
		var result = seed;
		self.loop(function (value) {
			result = func(result, value);
		});
		return result;
	};
	/**
	 * Collect all the values from an enumerable into an Array
	 * @returns {Array} An array containing all the enumerable values
	 */
	this.toArray = function toArrayInternal() {
		return self.aggregate(function (seed, value) {
			seed.push(value);
			return seed;
		}, []);
	};
	/**
	 * Sum all the values in an enumerable
	 * @returns {Number} The sum of the values
	 */
	this.sum = function sumInternal() {
		return self.aggregate(function (seed, value) {
			return seed + value;
		}, 0);
	};
	/**
	 * Count all the values in an enumerable
	 * @returns {Number} The number of the values in the enumerable
	 */
	this.count = function countInternal() {
		return self.aggregate(function (seed, value) {
			return seed + 1;
		}, 0);
	};

}
crafity.Enumerable = Enumerable;

Enumerable.create = Enumerable.from = function fromInternal(enumerable) {
	return new Enumerable(enumerable);
};

(function loaded() {

	//	var obj = [
	//		{ "x": 1, "y": [1,2,3,4,5] },
	//		{ "x": 2, "y": [6,7,8,9,10] }
	//	];
	//
	//	var result = new crafity.Enumerable(obj)
	//		.union([{ "x": 3, "y": [11,12,13,14,15] }])
	//		.selectMany(function (o) { return o.y; })
	//		.sum();
	//
	//	debug.log("sum", result);

	return;

	var obj = [
		{
			name: "root",
			children: [
				{
					name: "branch",
					children: [
						{
							name: "leave",
							children: []
						}
					]
				}
			]
		}
	];

	obj.asEnumerable().recursive(
		function(o) {
			return o.children;
		}).loop(function(item) {
			debug.log(item.name);
		});

	return;

	/**
	 * An enumerable containing a list of numbers
	 * @type {Enumerable}
	 */
	var numbers = new Enumerable([1, 2, 3, 4, 5]),
		/**
		 * A range of values
		 * @type {Enumerable}
		 */
			range = numbers
			.skip(2)
			.take(3)
			.select(
			function (number) {
				return number + 1;
			});

	debug.log("Numbers", numbers.toArray());
	debug.log("Range", range.toArray());
	debug.log("SUM", range.sum());
}());
