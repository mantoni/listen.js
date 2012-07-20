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


test('push', {

  before: function () {
    this.listener = listen();
  },


  'should add value to values for then-callback': function () {
    var spy = sinon.spy();

    this.listener.push('a');
    this.listener.push('b');
    this.listener.then(spy);

    sinon.assert.calledWith(spy, null, ['a', 'b']);
  },


  'should add value at second position if callback pending': function () {
    var spy       = sinon.spy();
    var callback  = this.listener();

    this.listener.push('b');
    this.listener.then(spy);
    callback(null, 'a');

    sinon.assert.calledWith(spy, null, ['a', 'b']);
  },


  'should throw if called after then': function () {
    this.listener.then(function () {});
    var error;

    try {
      this.listener.push(1);
    } catch (e) {
      error = e;
    }

    assert.equal('Error', error.name);
    assert.equal('Cannot be called after then', error.message);
  }


});
