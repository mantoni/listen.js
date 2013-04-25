var events = require('events');

process.__proto__ = new events.EventEmitter();
process.stdout = {
  write : function (s) { console.log(s.replace(/\n$/, ''));  }
};
process.reallyExit = function () {};

if (!Function.prototype.bind) {
  Function.prototype.bind = function (scope) {
    var fn = this;
    return function () {
      return fn.apply(scope, arguments);
    };
  };
}

document.body.onload = function () {
  setTimeout(function () {
    process.emit('exit');
  }, 1);
};
