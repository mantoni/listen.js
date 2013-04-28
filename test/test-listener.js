/*
 * listen.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var test   = require('utest');
var assert = require('assert');
var sinon  = require('sinon');

var listen = require('../lib/listen');


test('listener', {

  before: function () {
    this.listener = listen();
    this.clock = sinon.useFakeTimers();
  },

  after: function () {
    this.clock.restore();
  },


  'returns callback function': function () {
    var callback = this.listener();

    assert.equal(typeof callback, 'function');
  },


  'throws if called after then': function () {
    this.listener.then(function () {});
    var error;

    try {
      this.listener();
    } catch (e) {
      error = e;
    }

    assert.equal('Error', error.name);
    assert.equal('Cannot be called after then', error.message);
  },


  'errs on timeout': function () {
    var spy = sinon.spy();

    this.listener(1000);
    this.listener.then(spy);
    this.clock.tick(999);

    sinon.assert.notCalled(spy);

    this.clock.tick(1);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, {
      name : 'TimeoutError'
    });
  },


  'does not set a timeout by default': function () {
    var spy = sinon.spy();

    this.listener();
    this.listener.then(spy);
    this.clock.tick(1);

    sinon.assert.notCalled(spy);
  },


  'does not resolve if waiting for another callback': function () {
    var spy = sinon.spy();

    this.listener(1000);
    this.listener();
    this.listener.then(spy);
    this.clock.tick(1000);

    sinon.assert.notCalled(spy);
  },


  'clears timeout': function () {
    var spy       = sinon.spy();
    var callback1 = this.listener(250);
    var callback2 = this.listener();
    this.listener.then(spy);

    callback1();
    this.clock.tick(250);
    callback2();

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, null);
  },


  'ignores callback arguments after timeout': function () {
    var spy       = sinon.spy();
    var callback1 = this.listener(500);
    var callback2 = this.listener();
    this.listener.then(spy);

    this.clock.tick(500);
    callback1(new TypeError());
    callback2();

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, {
      name : 'TimeoutError'
    });
  },


  'invokes given function': function () {
    var spy      = sinon.spy();
    var callback = this.listener(spy);

    callback();

    sinon.assert.calledOnce(spy);
  },


  'passes error to callback': function () {
    var spy      = sinon.spy();
    var callback = this.listener(spy);
    var err      = new Error();

    callback(err);

    sinon.assert.calledWith(spy, err);
  },


  'passes null and value to callback': function () {
    var spy      = sinon.spy();
    var callback = this.listener(spy);

    callback(null, 'some value');

    sinon.assert.calledWith(spy, null, 'some value');
  },


  'allows to combine function and timeout arguments': function () {
    var spy      = sinon.spy();
    var callback = this.listener(spy, 250);

    this.clock.tick(250);

    sinon.assert.calledWithMatch(spy, {
      name : 'TimeoutError'
    });
  },


  'invokes given function before resolving the listener': function () {
    var spy1     = sinon.spy();
    var spy2     = sinon.spy();
    var callback = this.listener(spy1);
    this.listener.then(spy2);

    callback();

    sinon.assert.callOrder(spy1, spy2);
  },


  'passes error thrown in given function to then': function () {
    var err      = new Error('ouch');
    var callback = this.listener(sinon.stub().throws(err));
    var spy      = sinon.spy();
    this.listener.then(spy);

    callback();

    sinon.assert.calledWith(spy, err);
  },


  'combines error thrown in given function with err passed to callback':
    function () {
      var err1      = new Error('ouch');
      var err2      = new Error('oh noes');
      var callback = this.listener(sinon.stub().throws(err1));
      var spy      = sinon.spy();
      this.listener.then(spy);

      callback(err2);

      sinon.assert.calledWithMatch(spy, {
        name   : 'ErrorList',
        errors : [err1, err2]
      });
    },


  'does not create an error list if the given function re-throws the error':
    function () {
      var err      = new Error('ouch');
      var callback = this.listener(function (e) { throw e; });
      var spy      = sinon.spy();
      this.listener.then(spy);

      callback(err);

      sinon.assert.calledWith(spy, err);
    }

});
