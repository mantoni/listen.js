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


describe('listener', function () {
  var listener;
  var clock;

  beforeEach(function () {
    listener = listen();
    clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    clock.restore();
  });

  it('returns callback function', function () {
    var callback = listener();

    assert.equal(typeof callback, 'function');
  });

  it('throws if called after then', function () {
    listener.then(function () { return; });
    var error;

    try {
      listener();
    } catch (e) {
      error = e;
    }

    assert.equal('Error', error.name);
    assert.equal('Cannot be called after then', error.message);
  });

  it('errs on timeout', function () {
    var spy = sinon.spy();

    listener(1000);
    listener.then(spy);
    clock.tick(999);

    sinon.assert.notCalled(spy);

    clock.tick(1);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, {
      name: 'TimeoutError'
    });
  });

  it('does not set a timeout by default', function () {
    var spy = sinon.spy();

    listener();
    listener.then(spy);
    clock.tick(1);

    sinon.assert.notCalled(spy);
  });

  it('does not resolve if waiting for another callback', function () {
    var spy = sinon.spy();

    listener(1000);
    listener();
    listener.then(spy);
    clock.tick(1000);

    sinon.assert.notCalled(spy);
  });

  it('clears timeout', function () {
    var spy = sinon.spy();
    var callback1 = listener(250);
    var callback2 = listener();
    listener.then(spy);

    callback1();
    clock.tick(250);
    callback2();

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, null);
  });

  it('ignores callback arguments after timeout', function () {
    var spy = sinon.spy();
    var callback1 = listener(500);
    var callback2 = listener();
    listener.then(spy);

    clock.tick(500);
    callback1(new TypeError());
    callback2();

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, {
      name: 'TimeoutError'
    });
  });

  it('invokes given function', function () {
    var spy = sinon.spy();
    var callback = listener(spy);

    callback();

    sinon.assert.calledOnce(spy);
  });

  it('passes error to callback', function () {
    var spy = sinon.spy();
    var callback = listener(spy);
    var err = new Error();

    callback(err);

    sinon.assert.calledWith(spy, err);
  });

  it('passes null and value to callback', function () {
    var spy = sinon.spy();
    var callback = listener(spy);

    callback(null, 'some value');

    sinon.assert.calledWith(spy, null, 'some value');
  });

  it('allows to combine function and timeout arguments', function () {
    var spy = sinon.spy();
    listener(spy, 250);

    clock.tick(250);

    sinon.assert.calledWithMatch(spy, {
      name: 'TimeoutError'
    });
  });

  it('invokes given function before resolving the listener', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var callback = listener(spy1);
    listener.then(spy2);

    callback();

    sinon.assert.callOrder(spy1, spy2);
  });

  it('passes error thrown in given function to then', function () {
    var err = new Error('ouch');
    var callback = listener(sinon.stub().throws(err));
    var spy = sinon.spy();
    listener.then(spy);

    callback();

    sinon.assert.calledWith(spy, err);
  });

  it('combines error thrown in given function with err passed to callback',
    function () {
      var err1 = new Error('ouch');
      var err2 = new Error('oh noes');
      var callback = listener(sinon.stub().throws(err1));
      var spy = sinon.spy();
      listener.then(spy);

      callback(err2);

      sinon.assert.calledWithMatch(spy, {
        name: 'ErrorList',
        errors: [err1, err2]
      });
    });

  it('does not create an error list if the given function re-throws the error',
    function () {
      var err = new Error('ouch');
      var callback = listener(function (e) { throw e; });
      var spy = sinon.spy();
      listener.then(spy);

      callback(err);

      sinon.assert.calledWith(spy, err);
    });

  it('makes results available by given name', function () {
    var callbackA = listener('A');
    var callbackB = listener('B');
    var spy = sinon.spy();
    listener.then(spy);

    callbackA(null, 'My name is A');
    callbackB(null, 'My name is B');

    sinon.assert.calledWithMatch(spy, null, {
      A: 'My name is A',
      B: 'My name is B'
    });
  });

  it('fails with TimeoutError for combined name, function and timeout args',
    function () {
      var spy = sinon.spy();
      listener('name', spy, 250);

      clock.tick(250);

      sinon.assert.calledWithMatch(spy, {
        name: 'TimeoutError'
      });
    });

  it('makes results available by name if combined with function and timeout',
    function () {
      var callback = listener('name', function () { return; }, 250);
      var spy = sinon.spy();
      listener.then(spy);

      callback(null, 'Success');

      sinon.assert.calledWithMatch(spy, null, {
        name: 'Success'
      });
    });

  it('fails with TimeoutError for combined name and timeout arguments',
    function () {
      listener('name', 250);
      var spy = sinon.spy();
      listener.then(spy);

      clock.tick(250);

      sinon.assert.calledWithMatch(spy, {
        name: 'TimeoutError'
      });
    });

  it('makes results available by name if combined with timeout', function () {
    var callback = listener('name', 250);
    var spy = sinon.spy();
    listener.then(spy);

    callback(null, 'Success');

    sinon.assert.calledWithMatch(spy, null, {
      name: 'Success'
    });
  });

});
