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

var listen    = require('../lib/listen');


test('listener', {

  before: function () {
    this.listener = listen();
  },


  'should return callback function': function () {
    var callback = this.listener();

    assert.equal(typeof callback, 'function');
  }


});
