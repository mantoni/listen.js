/**
 * listen.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var listen    = require('../lib/listen');
var ErrorList = require('../lib/error-list');


test('then', {

  before: function () {
    this.listener = listen();
    this.then     = this.listener.then;
  },


  'should require function argument': function () {
    var re    = /^TypeError: Function expected$/;
    var then  = this.then;

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
      then(function () {});
    });
  },


  'should invoke given function if no callbacks where created': function () {
    var spy = sinon.spy();

    this.then(spy);

    sinon.assert.calledOnce(spy);
  },


  'should invoke given function with null and empty array': function () {
    var spy = sinon.spy();

    this.then(spy);

    sinon.assert.calledWith(spy, null, []);
  },


  'should not invoke given function if callback was created': function () {
    var spy = sinon.spy();

    this.listener();
    this.then(spy);

    sinon.assert.notCalled(spy);
  },


  'should invoke given function if callback was already called': function () {
    var spy       = sinon.spy();
    var callback  = this.listener();

    callback();
    this.then(spy);

    sinon.assert.calledOnce(spy);
  },


  'should invoke given function after callback was called': function () {
    var spy       = sinon.spy();
    var callback  = this.listener();

    this.then(spy);
    callback();

    sinon.assert.calledOnce(spy);
  },


  'should invoke given function after two callbacks where called':
    function () {
      var spy       = sinon.spy();
      var callbackA = this.listener();
      var callbackB = this.listener();

      this.then(spy);
      callbackA();
      callbackB();

      sinon.assert.calledOnce(spy);
    },


  'should invoke given function with null and empty array after callback':
    function () {
      var spy       = sinon.spy();
      var callback  = this.listener();

      this.then(spy);
      callback();

      sinon.assert.calledWith(spy, null, []);
    },


  'should pass callback argument to given function': function () {
    var spy       = sinon.spy();
    var callback  = this.listener();

    callback(null, 123);
    this.then(spy);

    sinon.assert.calledWith(spy, null, [123]);
  },


  'should pass arguments from multiple callback to given function':
    function () {
      var spy       = sinon.spy();
      var callbackA = this.listener();
      var callbackB = this.listener();

      callbackA(null, false);
      callbackB(null, true);
      this.then(spy);

      sinon.assert.calledWith(spy, null, [false, true]);
    },


  'should pass callback arguments in order of callback creation':
    function () {
      var spy       = sinon.spy();
      var callbackA = this.listener();
      var callbackB = this.listener();

      callbackB(null, true);
      callbackA(null, false);
      this.then(spy);

      sinon.assert.calledWith(spy, null, [false, true]);
    },


  'should not confuse argument order': function () {
    var spy       = sinon.spy();

    var callbackA = this.listener();
    callbackA(null, false);
    var callbackB = this.listener();
    callbackB(null, true);
    this.then(spy);

    sinon.assert.calledWith(spy, null, [false, true]);
  },


  'should pass error to given function': function () {
    var spy       = sinon.spy();
    var err       = new RangeError();
    var callback  = this.listener();

    callback(err);
    this.then(spy);

    sinon.assert.calledWith(spy, err);
  },


  'should pass errors as ErrorList to given function': function () {
    var spy       = sinon.spy();
    var err1      = new RangeError();
    var err2      = new TypeError();
    var callbackA = this.listener();
    var callbackB = this.listener();

    this.then(spy);
    callbackA(err1);
    callbackB(err2);

    var errorList = spy.firstCall.args[0];
    assert.equal(errorList.name, 'ErrorList');
    assert.deepEqual(errorList.errors, [err1, err2]);
  },


  'should throw if called again': function () {
    var then = this.then;
    then(function () {});

    assert.throws(function () {
      then(function () {});
    }, /^Error: Cannot be called more than once$/);
  }


});
