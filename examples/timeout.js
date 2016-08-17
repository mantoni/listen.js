'use strict';

var listen = require('..');

function longRunning(callback) {
  setTimeout(callback, 500);
}

var listener = listen();

longRunning(listener(250));

listener.then(function (err) {
  if (err && err.name === 'TimeoutError') {
    console.warn('Timeout after 250 ms!');
  } else {
    console.log('Invoking the callback after a timeout does nothing.');
  }
});
