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

// ... do async stuff with callbacks

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

 - `listen()` - creates a new listener.
 - `listen(values)` - creates a new listener with initial values. The given argument must be an array.
 - `listener()` - creates a new callback associated with the listener. Throws if called after `then`.
 - `listener.then(func)` - invokes the given function once all callbacks where invoked. Throws if already called.
 - `listener.push(value)` - pushes a value to the internal values array. Throws if called after `then`.
 - `listener.err(error)` - adds an error to the internal error list. Throws if called after `then`.

## Run tests

```
make
```

## Compile for browsers and minify

This requires [nomo.js](https://github.com/mantoni/nomo.js).

```
make compile
```
