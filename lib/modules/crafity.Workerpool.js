/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, stupid: true */
"use strict";

/*!
 * crafity-workerpool - Schedule a bunch of task and receive notifications 
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Event = require('./crafity.Event')
  , EventEmitter = require('events').EventEmitter
  , Domain = require('./crafity.Domain')
  ;

/**
 *
 * @param name
 * @param async
 * @param debug
 * @param autostart
 * @param timeout
 */

function Workerpool(name, async, debug, autostart, timeout) {

  // Local Variables
  var selfWorkerpool = this
    , pool = []
    , finished = true
    , timeoutIdWorkerpool = null
    , running = [];

  async = async || false;
  debug = debug || false;

  function WorkerContext() {
    var selfWorkerContext = this
      , timeoutIdWorkerContext
      , innerOnCompleted = new Event("sync")
      , publicOnCompleteCallback
      , PublicWorkerContext;

    publicOnCompleteCallback = function (ex, result) {
      if (ex) { throw ex; }
      return result;
    };

    this.debug = debug || false;
    this.isStillSync = true;
    this.isAsync = false;
    this.asyncTimeout = 1000;
    this.onComplete = new Event("sync");
    this.isCompleted = false;

    PublicWorkerContext = function WorkerContext() {
      this.async = function (timeout) {
        if (selfWorkerContext.isAsync) {
          throw new Error('Can not call async twice on a worker context');
        }
        if (selfWorkerContext.isCompleted === true) {
          throw new Error('Can not call async after the work is done');
        }
        selfWorkerContext.isAsync = true;
        selfWorkerContext.asyncTimeout = timeout || selfWorkerContext.asyncTimeout;
      };
      this.debug = function () {
        selfWorkerContext.debug = true;
      };
      this.steps = function (steps) {
        var eventEmitter = new EventEmitter();

        function next() {
          process.nextTick(function () {
            var step = steps.shift();
            if (step) { step(next); } else { eventEmitter.emit("complete"); }
          });
        }

        next();
        return eventEmitter;
      };
      this.complete = function (ex, args) {
        if (!selfWorkerContext.isAsync) {
          throw new Error('Can not call complete on a non async context');
        }
        if (selfWorkerContext.isStillSync === true) {
          throw new Error('Can not call complete while still in sync');
        }
        if (selfWorkerContext.isCompleted === true) {
          return;
        }
        args = Array.prototype.slice.call(arguments);
        args.splice(0, 1);
        innerOnCompleted.raise(ex, args);
      };
      this.onComplete = function (callback) {
        if (!selfWorkerContext.isAsync) {
          throw new Error('Can not register for oncomplete on a non async worker context');
        }
        if (selfWorkerContext.isCompleted === true) {
          return;
        }
        publicOnCompleteCallback = callback;
      };
    };
    PublicWorkerContext.prototype = EventEmitter.prototype;
    this.run = function (work, callback) {
      selfWorkerContext.onComplete.subscribe(callback);

      var publicWorkerContext
        , output;

      function onCompleteHandler(ex, result) {
        if (selfWorkerContext.debug) { console.log(work.report ? "C O M P L E T E  " + work.report.name : ""); }
        if (selfWorkerContext.isCompleted) {
          throw new Error('Can not call the completed handler after completion');
        }
        selfWorkerContext.isCompleted = true;
        innerOnCompleted.unsubscribe(onCompleteHandler);
        clearTimeout(timeoutIdWorkerContext);
        try {
          result = publicOnCompleteCallback(ex, result);
          publicWorkerContext.emit("complete", ex, result);
          selfWorkerContext.onComplete.raise(null, result);
        } catch (err) {
          selfWorkerContext.onComplete.raise(err, null);
        }
        selfWorkerContext.onComplete.unsubscribe(callback);
      }

      innerOnCompleted.subscribe(onCompleteHandler);

      try {
        publicWorkerContext = new PublicWorkerContext();

        output = work.call(publicWorkerContext, publicWorkerContext);
        selfWorkerContext.isStillSync = false;
        if (selfWorkerContext.debug) { console.log("Sychronous part is done", work.report.name, innerOnCompleted.listenerCount); }
        if (!selfWorkerContext.isAsync) {
          onCompleteHandler(null, output);
        } else {
          timeoutIdWorkerContext = setTimeout(function () {
            timeoutIdWorkerContext = null;
            if (selfWorkerContext.debug) { console.log("TIMEEEE OUTTTT....", work.report.name, innerOnCompleted.listenerCount); }
            innerOnCompleted.raise(new Error("Work item exceeded the specified time out"), null);
          }, selfWorkerContext.asyncTimeout);
          if (selfWorkerContext.debug) { console.log("Time out is set", selfWorkerContext.asyncTimeout, timeoutIdWorkerContext.toString(), work.report.name, innerOnCompleted.listenerCount); }
        }
      } catch (ex) {
        onCompleteHandler(ex, null);
      }
    };
  }

  WorkerContext.prototype = EventEmitter.prototype;

  // Events
  this.onWorkStopped = new Event("sync");
  this.onWorkStarted = new Event("sync");
  this.onWorkCompleted = new Event("sync");
  this.onWorkItemStarted = new Event("sync");
  this.onWorkItemCompleted = new Event("sync");

  // Properties
  this.working = false;

  // Functions
  this.add = function (work) {
    if (work === undefined) {
      throw new Error('Argument "work" is undefined');
    }
    finished = false;
    pool.push(work);
  };

  this.work = function (timeout) {
    selfWorkerpool.working = true;
    selfWorkerpool.onWorkStarted.raise();
    if (timeout > 0) {
      timeoutIdWorkerpool = setTimeout(function () {
        selfWorkerpool.stop();
        selfWorkerpool.onWorkCompleted.raise(new Error("Work item exceeded the specified time out"));
      }, timeout);
    }
    function processWorkItem() {
      if (!selfWorkerpool.working) { return; }
      if (pool.length > 0) {
        var workItem = pool[0]
          , workerContext;
        running.push(workItem.report ? workItem.report.name : workItem);
        pool.splice(0, 1);
        workerContext = new WorkerContext();
        selfWorkerpool.onWorkItemStarted.raise(null, workItem);
        setTimeout(function () {
          if (!selfWorkerpool.working) {
            return;
          }
          var domain = Domain.createDomain();
          domain.run(function () {
            workerContext.run(workItem, function (err) {
              running.pop();
              selfWorkerpool.onWorkItemCompleted.raise(err, workItem);
              if (!async) {
                setTimeout(processWorkItem, 10);
              }
            });

          });
          domain.on("error", function (err) {
            running.pop();
            selfWorkerpool.onWorkItemCompleted.raise(err, workItem);
            if (!async) {
              setTimeout(processWorkItem, 10);
            }
          });
          if (async) {
            setTimeout(processWorkItem, 10);
          }
        }, 1);
      } else {
        if (!finished && running.length === 0) {
          finished = true;
          if (!selfWorkerpool.working) { return; }
          selfWorkerpool.onWorkCompleted.raise();
        }
        if (!selfWorkerpool.working) { return; }
        setTimeout(processWorkItem, 100);
      }
    }

    setTimeout(processWorkItem, 1);
  };

  this.stop = function () {
    clearTimeout(timeoutIdWorkerpool);
    selfWorkerpool.working = false;
    running = [];
    selfWorkerpool.onWorkStopped.raise();
  };

  if (autostart) {
    selfWorkerpool.work(timeout);
  }
}
Workerpool.prototype = EventEmitter.prototype;

/**
 * Initialize module
 */

module.exports = Workerpool;

/**
 * Module name.
 */

exports.fullname = "crafity.Workerpool";

/**
 * Module version.
 */

exports.version = '0.0.1';

