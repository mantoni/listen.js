var page = require('webpage').create();
page.open('support/test.html', function () {

  page.onConsoleMessage = function (msg) {
    console.log(msg);
  };

  page.onError = function (msg, trace) {
    var m = [msg];
    trace.forEach(function (t) {
      if (t.function) {
        m.push(t.function + ' (' + t.file + ':' + t.line + ')');
      }
    });
    console.log(m.join('\n    at '));
  };

  setTimeout(function () {
    phantom.exit();
  }, 1);
});
