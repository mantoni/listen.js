/**
 * listen.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var ErrorList = require('./error-list');

function listen(values) {
  if (arguments.length) {
    if (Object.prototype.toString.call(values) !== '[object Array]') {
      throw new TypeError('Array expected');
    }
    values = Array.prototype.slice.call(values);
  } else {
    values = [];
  }

  var offset  = values.length;
  var count   = 0;
  var errList;
  var handler;

  function resolve(fn) {
    if (errList) {
      fn(errList.length === 1 ? errList[0] : new ErrorList(errList));
    } else {
      fn(null, values);
    }
  }

  function listener() {
    var index = offset + count++;
    return function (err, value) {
      if (err) {
        listener.err(err);
      }
      if (value !== undefined) {
        values[index] = value;
      }
      if (!--count && handler) {
        resolve(handler);
      }
    };
  };

  listener.push = function push(value) {
    values[offset + count] = value;
    offset++;
  };

  listener.err = function err(err) {
    if (!errList) {
      errList = [];
    }
    errList.push(err);
  };

  listener.then = function then(fn) {
    if (handler) {
      throw new Error('Cannot be called more than once');
    }
    if (typeof fn !== 'function') {
      throw new TypeError('Function expected');
    }
    handler = fn;
    if (!count) {
      resolve(fn);
    }
  };

  return listener;
}

listen.ErrorList = ErrorList;

module.exports = listen;
