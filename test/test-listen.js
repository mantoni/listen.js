/*
 * listen.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var listen    = require('../lib/listen');
var ErrorList = require('../lib/error-list');


test('listen', {


  'should return listener function': function () {
    var listener = listen();

    assert.equal(typeof listener, 'function');
  },


  'should require given argument to be array': function () {
    var re = /^TypeError: Array expected$/;

    assert.throws(function () {
      listen(undefined);
    }, re);
    assert.throws(function () {
      listen(null);
    }, re);
    assert.throws(function () {
      listen(false);
    }, re);
    assert.throws(function () {
      listen({});
    }, re);

    assert.doesNotThrow(function () {
      listen([]);
    });
  },


  'should append callback value to given value': function () {
    var spy       = sinon.spy();
    var listener  = listen(['a']);
    var callback  = listener();

    listener.then(spy);
    callback(null, 'b');

    sinon.assert.calledWith(spy, null, ['a', 'b']);
  },


  'should append callback values to given values': function () {
    var spy       = sinon.spy();
    var listener  = listen(['a', 'b']);
    var callbackA = listener();
    var callbackB = listener();

    listener.then(spy);
    callbackB(null, 'd');
    callbackA(null, 'c');

    sinon.assert.calledWith(spy, null, ['a', 'b', 'c', 'd']);
  },


  'should not modify given values array': function () {
    var values    = [];
    var listener  = listen(values);
    var callback  = listener();

    callback(null, 1);

    assert.equal(0, values.length);
  },


  'should expose ErrorList': function () {
    assert.strictEqual(listen.ErrorList, ErrorList);
  }

});
