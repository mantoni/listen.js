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
  },


  'should throw if called after then': function () {
    this.listener.then(function () {});
    var error;

    try {
      this.listener();
    } catch (e) {
      error = e;
    }

    assert.equal('Error', error.name);
    assert.equal('Cannot be called after then', error.message);
  }


});
