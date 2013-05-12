# listen.js [![Build Status](https://secure.travis-ci.org/mantoni/listen.js.png?branch=master)](http://travis-ci.org/mantoni/listen.js)

Wait for the results of multiple callbacks

Homepage: <http://maxantoni.de/projects/listen.js/>

Repository: <https://github.com/mantoni/listen.js>

---

## Install with NPM

```
npm install listen
```

## Download for browsers

Standalone browser package are here: <http://maxantoni.de/listen.js/>

You can also use npm and bundle it with your application using
[Browserify](http://browserify.org).


## Development

Here is what you need:

 - `npm install` will install all the dev dependencies
 - `make` does all of the following
 - `make lint` lint the code with JSLint
 - `make test` runs all unit tests in Node
 - `make browser` generates a static web page at `test/all.html` to run the tests in a browser.
 - `make phantom` runs all tests in a the headless [Phantom.JS](http://phantomjs.org). Make sure you have `phantomjs` in your path.

To build a browser package containing the merged / minified scripts run `make package`.
