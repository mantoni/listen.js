# listen.js [![Build Status](https://secure.travis-ci.org/mantoni/listen.js.png?branch=master)](http://travis-ci.org/mantoni/listen.js)

Wait for the results of multiple callbacks

Repository: https://github.com/mantoni/listen.js


## Install with NPM

```
npm install listen
```

## Download for browsers

Standalone browser package are here: http://maxantoni.de/listen.js/
However, you may want to use npm and bundle it with your application using
[Browserify](http://browserify.org).


## Usage

```js
var listen = require('listen');

var listener = listen();

var callbackA = listener();
var callbackB = listener();

/*
 * Do async stuff with callbacks.
 *
 * Callbacks follow the Node.js convention. They expect an error or null as
 * the first argument and an optional value as the second:
 *
 * Fail: callback(new Error('ouch!'));
 * Return: callback(null, 'some return value');
 */

listener.then(function (err, values) {
  /*
   * err    - 1) null if no callback err'd
   *          2) the error of the callback that err'd
   *          3) an error with name ErrorList wrapping multiple errors
   *
   * values - The non-undefined return values from all callbacks in order of
   *          callback creation
   */
});
```

## API

#### `listen()`
Creates and returns a new listener function.

#### `listen(values)`
Creates and returns a new listener with the given initial values.

#### `listener()`
Creates a new callback associated with the listener. Throws if called after `then`.

#### `listener(timeout)`
Creates a new callback that errs with a `TimeoutError` if the callback was not invoked within the given timeout.

#### `listener(func)`
Creates a new callback that also invokes the given function with `(err, value)`.

#### `listener(func, timeout)`
Combined `listener(func)` and `listener(timeout)`.

#### `listener.then(func)`
Invokes the given function once all callbacks where invoked. If none of the callbacks had errors, the first argument is `null`, otherwise it's an `Error`. The second argument is the values array in order of callback creation. Can only be called once.

#### `listener.push(value)`
Pushes a value to the internal values array. Throws if called after `then`.

#### `listener.err(error)`
Adds an error to the internal error list. Throws if called after `then`.


## Contributing

Here is what you need for development:

 - `npm install` will install all the dev dependencies
 - `make` does all of the following
 - `make lint` lint the code with JSLint
 - `make test` runs all unit tests in Node
 - `make browser` generates a static web page at `test/all.html` to run the tests in a browser.
 - `make phantom` runs all tests in a the headless [Phantom.JS](http://phantomjs.org). Make sure you have `phantomjs` in your path.

To build a browser package containing the merged / minified scripts run `make package`.
