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


test('err', {

  before: function () {
    this.listener = listen();
  },


  'should add error to error-list for then-callback': function () {
    var spy = sinon.spy();

    this.listener.err('a');
    this.listener.err('b');
    this.listener.then(spy);

    assert.deepEqual(spy.firstCall.args[0].errors, ['a', 'b']);
  }


});
