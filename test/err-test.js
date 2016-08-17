/*
 * listen.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*global describe, it, beforeEach*/
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var listen = require('../lib/listen');
var ErrorList = require('../lib/error-list');


describe('err', function () {
  var listener;

  beforeEach(function () {
    listener = listen();
  });

  it('adds error to error-list for then-callback', function () {
    var spy = sinon.spy();

    listener.err('a');
    listener.err('b');
    listener.then(spy);

    sinon.assert.calledWithMatch(spy, {
      errors : ['a', 'b']
    });
  });

  it('adds error-list to error-list for then-callback', function () {
    var spy = sinon.spy();

    listener.err('a');
    listener.err(new ErrorList(['b', 'c']));
    listener.then(spy);

    sinon.assert.calledWithMatch(spy, {
      errors : ['a', 'b', 'c']
    });
  });

  it('throws if called after then', function () {
    listener.then(function () { return; });
    var error;

    try {
      listener.err();
    } catch (e) {
      error = e;
    }

    assert.equal('Error', error.name);
    assert.equal('Cannot be called after then', error.message);
  });

});
