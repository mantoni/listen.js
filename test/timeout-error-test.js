/*
 * listen.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*global describe, it*/
'use strict';

var assert = require('assert');
var TimeoutError  = require('../lib/timeout-error');


describe('timeout-error', function () {

  it('is an error', function () {
    var error = new TimeoutError();

    assert(error instanceof Error);
  });

  it('has name TimeoutError', function () {
    var error = new TimeoutError([]);

    assert.equal(error.name, 'TimeoutError');
  });

});
