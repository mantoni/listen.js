'use strict';

var fs = require('fs');
var listen = require('..');

fs.readdir('examples', function (err, files) {

  var listener = listen();
  files.forEach(function (file) {
    fs.readFile('examples/' + file, listener());
  });

  listener.then(function (err, fileContents) {
    // fileContents is guaranteed to have the same order as files
    fileContents.forEach(function (buffer, i) {
      console.log('%s: %d bytes', files[i], Buffer.byteLength(buffer));
    });
  });
});
