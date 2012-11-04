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


test('listener', {

  before: function () {
    this.listener = listen();
    this.clock = sinon.useFakeTimers();
  },

  after: function () {
    this.clock.restore();
  },


  'should return callback function': function () {
    var callback = this.listener();

    assert.equal(typeof callback, 'function');
  },


  'should throw if called after then': function () {
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


  'should err on timeout': function () {
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


  'should not set a timeout by default': function () {
    var spy = sinon.spy();

    this.listener();
    this.listener.then(spy);
    this.clock.tick(1);

    sinon.assert.notCalled(spy);
  },


  'should not resolve if waiting for another callback': function () {
    var spy = sinon.spy();

    this.listener(1000);
    this.listener();
    this.listener.then(spy);
    this.clock.tick(1000);

    sinon.assert.notCalled(spy);
  },


  'should clear timeout': function () {
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


  'should ignore callback arguments after timeout': function () {
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
  }


});
