'use strict';

var fs = require('fs');
var listen = require('..');

var listener = listen();

fs.readFile('package.json', listener('json'));
fs.readFile('LICENSE', listener('license'));
fs.readFile('README.md', listener('readme'));

listener.then(function (err, results) {
  console.log('package.json: %d bytes', Buffer.byteLength(results.json));
  console.log('LICENSE: %d bytes', Buffer.byteLength(results.license));
  console.log('README.md: %d bytes', Buffer.byteLength(results.readme));
});
