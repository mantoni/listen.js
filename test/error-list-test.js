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
var ErrorList = require('../lib/error-list');


describe('error-list', function () {

  it('is an error', function () {
    var error = new ErrorList([]);

    assert(error instanceof Error);
  });

  it('has name ErrorList', function () {
    var error = new ErrorList([]);

    assert.equal(error.name, 'ErrorList');
  });

  it('exposes given errors', function () {
    var errors = [new TypeError(), new RangeError()];

    var error = new ErrorList(errors);

    assert.strictEqual(error.errors, errors);
  });

});
