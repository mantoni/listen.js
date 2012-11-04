# listen.js

Wait for the results of multiple callbacks.

[![Build Status](https://secure.travis-ci.org/mantoni/listen.js.png?branch=master)](http://travis-ci.org/mantoni/listen.js)

## Install

```
npm install listen
```

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

#### `listen([values])`
Creates and returns a new listener. The values array with initial values is optional.

#### `listener([timeout])`
Creates a new callback associated with the listener. If the optional timeout is given, the listener errs with a `TimeoutError` if the callback was not invoked. Throws if called after `then`.

#### `listener.then(func)`
Invokes the given function once all callbacks where invoked. If none of the callbacks had errors, the first argument is `null`, otherwise it's an `Error`. The second argument is the values array in order of callback creation. Can only be called once.

#### `listener.push(value)`
Pushes a value to the internal values array. Throws if called after `then`.

#### `listener.err(error)`
Adds an error to the internal error list. Throws if called after `then`.

## Run tests

```
make
```

## Hacking

If you'd like to hack listen.js here is how to get started:

 - `npm install` will setup everything you need.
 - `make` lints the code with JSLint and runs all unit tests.
 - Use can also `make lint` or `make test` individually.

Running the test cases in a browser instead of Node requires [nomo.js](https://github.com/mantoni/nomo.js).

 - Run `npm install -g nomo`
 - Run `nomo server` from within the project directory.
 - Open http://localhost:4444/test in your browser.

To build a browser package containing the merged / minified scripts run `make package`.
