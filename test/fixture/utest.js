if (!Function.prototype.bind) {
  Function.prototype.bind = function (scope) {
    var fn = this;
    return function () {
      return fn.apply(scope, arguments);
    };
  };
}

var test = require('utest');
test.Reporter = test.ConsoleReporter;

// Not shimed by Browserify:
process.exit = function () {};
