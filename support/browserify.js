var events = require('events');

// process is not an EventEmitter in browserify:
process.__proto__ = new events.EventEmitter();
// and does not implement stdout:
process.stdout = {
  write : function (s) { console.log(s.replace(/\n$/, ''));  }
};
// utest uses this undocumented node feature:
process.reallyExit = function () {};

// https://github.com/ariya/phantomjs/issues/10522
if (!Function.prototype.bind) {
  Function.prototype.bind = function (scope) {
    var fn = this;
    return function () {
      return fn.apply(scope, arguments);
    };
  };
}

// utest prints the summary on exit:
document.body.onload = function () {
  setTimeout(function () {
    process.emit('exit');
  }, 1);
};
