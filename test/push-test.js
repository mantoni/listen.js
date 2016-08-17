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


describe('push', function () {
  var listener;

  beforeEach(function () {
    listener = listen();
  });

  it('adds value to values for then-callback', function () {
    var spy = sinon.spy();

    listener.push('a');
    listener.push('b');
    listener.then(spy);

    sinon.assert.calledWith(spy, null, ['a', 'b']);
  });

  it('adds value at second position if callback pending', function () {
    var spy = sinon.spy();
    var callback = listener();

    listener.push('b');
    listener.then(spy);
    callback(null, 'a');

    sinon.assert.calledWith(spy, null, ['a', 'b']);
  });

  it('throws if called after then', function () {
    listener.then(function () { return; });
    var error;

    try {
      listener.push(1);
    } catch (e) {
      error = e;
    }

    assert.equal('Error', error.name);
    assert.equal('Cannot be called after then', error.message);
  });

});
