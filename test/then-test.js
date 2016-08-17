/*
 * listen.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*global describe, it, beforeEach, afterEach*/
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var listen = require('../lib/listen');
var ErrorList = require('../lib/error-list');


describe('then', function () {
  var listener;
  var then;

  beforeEach(function () {
    listener = listen();
    then = listener.then;
  });

  it('requires function argument', function () {
    var re = /^TypeError: Function expected$/;

    assert.throws(function () {
      then(null);
    }, re);
    assert.throws(function () {
      then(false);
    }, re);
    assert.throws(function () {
      then({});
    }, re);

    assert.doesNotThrow(function () {
      then(function () { return; });
    });
  });

  it('invokes given function if no callbacks where created', function () {
    var spy = sinon.spy();

    then(spy);

    sinon.assert.calledOnce(spy);
  });

  it('invokes given function with null and empty array', function () {
    var spy = sinon.spy();

    then(spy);

    sinon.assert.calledWith(spy, null, []);
  });

  it('does not invoke given function if callback was created', function () {
    var spy = sinon.spy();

    listener();
    then(spy);

    sinon.assert.notCalled(spy);
  });

  it('invokes given function if callback was already called', function () {
    var spy = sinon.spy();
    var callback = listener();

    callback();
    then(spy);

    sinon.assert.calledOnce(spy);
  });

  it('invokes given function after callback was called', function () {
    var spy = sinon.spy();
    var callback = listener();

    then(spy);
    callback();

    sinon.assert.calledOnce(spy);
  });

  it('invokes given function after two callbacks where called', function () {
    var spy = sinon.spy();
    var callbackA = listener();
    var callbackB = listener();

    then(spy);
    callbackA();
    callbackB();

    sinon.assert.calledOnce(spy);
  });

  it('invokes given function with null and empty array after callback',
    function () {
      var spy = sinon.spy();
      var callback = listener();

      then(spy);
      callback(); // undefined value is ignored.

      sinon.assert.calledWith(spy, null, []);
    });

  it('passes callback argument to given function', function () {
    var spy = sinon.spy();
    var callback = listener();

    callback(null, 123);
    then(spy);

    sinon.assert.calledWith(spy, null, [123]);
  });

  it('passes arguments from multiple callback to given function', function () {
    var spy = sinon.spy();
    var callbackA = listener();
    var callbackB = listener();

    callbackA(null, false);
    callbackB(null, true);
    then(spy);

    sinon.assert.calledWith(spy, null, [false, true]);
  });

  it('passes callback arguments in order of callback creation', function () {
    var spy = sinon.spy();
    var callbackA = listener();
    var callbackB = listener();

    callbackB(null, true);
    callbackA(null, false);
    then(spy);

    sinon.assert.calledWith(spy, null, [false, true]);
  });

  it('does not confuse argument order', function () {
    var spy = sinon.spy();

    var callbackA = listener();
    callbackA(null, false);
    var callbackB = listener();
    callbackB(null, true);
    then(spy);

    sinon.assert.calledWith(spy, null, [false, true]);
  });

  it('does not pass undefined from first value', function () {
    var spy = sinon.spy();

    var callbackA = listener();
    var callbackB = listener();
    var callbackC = listener();
    callbackA();
    callbackB(null, 'B');
    callbackC(null, 'C');
    then(spy);

    sinon.assert.calledWith(spy, null, ['B', 'C']);
  });

  it('does not pass undefined from second value', function () {
    var spy = sinon.spy();

    var callbackA = listener();
    var callbackB = listener();
    var callbackC = listener();
    callbackA(null, 'A');
    callbackB();
    callbackC(null, 'C');
    then(spy);

    sinon.assert.calledWith(spy, null, ['A', 'C']);
  });

  it('does not pass undefined from third value', function () {
    var spy = sinon.spy();

    var callbackA = listener();
    var callbackB = listener();
    var callbackC = listener();
    callbackA(null, 'A');
    callbackB(null, 'B');
    callbackC();
    then(spy);

    sinon.assert.calledWith(spy, null, ['A', 'B']);
  });

  it('passes error to given function', function () {
    var spy = sinon.spy();
    var err = new RangeError();
    var callback  = listener();

    callback(err);
    then(spy);

    sinon.assert.calledWith(spy, err);
  });

  it('passes errors as ErrorList to given function', function () {
    var spy = sinon.spy();
    var err1 = new RangeError();
    var err2 = new TypeError();
    var callbackA = listener();
    var callbackB = listener();

    then(spy);
    callbackA(err1);
    callbackB(err2);

    var errorList = spy.firstCall.args[0];
    assert.equal(errorList.name, 'ErrorList');
    assert.deepEqual(errorList.errors, [err1, err2]);
  });

  it('throws if called again', function () {
    function noop() { return; }
    var error;
    then(noop);

    try {
      then(noop);
    } catch (e) {
      error = e;
    }

    assert.equal('Error', error.name);
    assert.equal('Cannot be called more than once', error.message);
  });

});
