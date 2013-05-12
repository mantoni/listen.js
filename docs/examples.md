### Examples

The examples on this page are based on use cases for Node.js, but the concepts
can be applied in a browser environment as well.

#### Named callbacks

```js
var listener = listen();

fs.readFile('some.json', listener('json'));
fs.readFile('some.html', listener('html'));

listener.then(function (err, results) {
  console.log('JSON:', results.json);
  console.log('HTML:', results.html);
});
```

#### Timeouts

```js
var listener = listen();

longRunningFunctionWithCallback(listener(5000));

listener.then(function (err) {
  if (err && err.name === 'TimeoutError') {
    console.warn('Timeout after 5 seconds!');
  }
});
```

#### Result list

```js
fs.readdir('some/dir', function (err, files) {
  if (err) {
    throw err;
  }
  var listener = listen();
  files.forEach(function (file) {
    fs.readFile(file, listener());
  });
  listener.then(function (err, fileContents) {
    // fileContents is guaranteed to have the same order as files
  });
});
```
