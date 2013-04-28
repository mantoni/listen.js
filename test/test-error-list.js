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

var ErrorList = require('../lib/error-list');


test('error-list', {


  'is an error': function () {
    var error = new ErrorList([]);

    assert(error instanceof Error);
  },


  'has name ErrorList': function () {
    var error = new ErrorList([]);

    assert.equal(error.name, 'ErrorList');
  },


  'exposes given errors': function () {
    var errors  = [new TypeError(), new RangeError()];

    var error   = new ErrorList(errors);

    assert.strictEqual(error.errors, errors);
  }


});
