/**
 * listen.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var ErrorList = require('./error-list');

function listen(initialValues) {
  var values;
  if (arguments.length) {
    if (Object.prototype.toString.call(initialValues) !== '[object Array]') {
      throw new TypeError('Array expected');
    }
    values = Array.prototype.slice.call(initialValues);
  } else {
    values = [];
  }

  var offset  = values.length;
  var count   = 0;
  var called  = 0;
  var errList;
  var handler;

  function resolve(fn) {
    if (errList) {
      fn(errList.length === 1 ? errList[0] : new ErrorList(errList));
    } else {
      fn(null, values);
    }
  }

  function assertUnresolved() {
    if (handler) {
      throw new Error("Cannot be called after then");
    }
  }

  function pushError(e) {
    if (!errList) {
      errList = [];
    }
    errList.push(e);
  }

  function listener() {
    assertUnresolved();
    var index = offset + count++;
    return function (err, value) {
      if (err) {
        pushError(err);
      }
      if (value !== undefined) {
        values[index] = value;
      }
      if (++called === count && handler) {
        resolve(handler);
      }
    };
  }

  listener.push = function push(value) {
    assertUnresolved();
    values[offset + count] = value;
    offset++;
  };

  listener.err = function err(e) {
    assertUnresolved();
    pushError(e);
  };

  listener.then = function then(fn) {
    if (handler) {
      throw new Error('Cannot be called more than once');
    }
    if (typeof fn !== 'function') {
      throw new TypeError('Function expected');
    }
    handler = fn;
    if (called === count) {
      resolve(fn);
    }
  };

  return listener;
}

listen.ErrorList = ErrorList;

module.exports = listen;
