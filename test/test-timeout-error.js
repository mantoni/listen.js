/*
 * listen.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var test          = require('utest');
var assert        = require('assert');

var TimeoutError  = require('../lib/timeout-error');


test('timeout-error', {


  'is an error': function () {
    var error = new TimeoutError();

    assert(error instanceof Error);
  },


  'has name TimeoutError': function () {
    var error = new TimeoutError([]);

    assert.equal(error.name, 'TimeoutError');
  }


});
