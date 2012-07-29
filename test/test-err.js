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


test('err', {

  before: function () {
    this.listener = listen();
  },


  'should add error to error-list for then-callback': function () {
    var spy = sinon.spy();

    this.listener.err('a');
    this.listener.err('b');
    this.listener.then(spy);

    sinon.assert.calledWithMatch(spy, {
      errors : ['a', 'b']
    });
  },


  'should add error-list to error-list for then-callback': function () {
    var spy = sinon.spy();

    this.listener.err('a');
    this.listener.err(new ErrorList(['b', 'c']));
    this.listener.then(spy);

    sinon.assert.calledWithMatch(spy, {
      errors : ['a', 'b', 'c']
    });
  },


  'should throw if called after then': function () {
    this.listener.then(function () {});
    var error;

    try {
      this.listener.err();
    } catch (e) {
      error = e;
    }

    assert.equal("Error", error.name);
    assert.equal("Cannot be called after then", error.message);
  }


});
