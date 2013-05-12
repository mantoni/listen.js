### API reference

Start with `var listen = require('listen');`. Then use the exported `listen`
function to create listeners. Use the listeners to create callbacks.

#### listen()

Creates and returns a new listener function.

#### listen(values)

Creates and returns a new listener with the given initial values.

#### listener()

Creates a new callback associated with the listener. Throws if called after
`then`.

#### listener(name)

Creates a new named callback that provides its value under the given name.

#### listener(timeout)

Creates a new callback that errs with a `TimeoutError` if the callback was not
invoked within the given timeout.

#### listener(func)

Creates a new callback that also invokes the given function with `(err,
value)`.

#### listener(name, func)

Combined `listener(name)` and `listener(func)`.

#### listener(name, timeout)

Combined `listener(name)` and `listener(timeout)`.

#### listener(func, timeout)

Combined `listener(func)` and `listener(timeout)`.

#### listener(name, func, timeout)

Combined `listener(name)`, `listener(func)` and `listener(timeout)`.

#### listener.then(func)

Invokes the given function once all callbacks where invoked. If none of the
callbacks had errors, the first argument is `null`, otherwise it's an `Error`.
The second argument is the values array in order of callback creation. Can only
be called once.

#### listener.push(value)

Pushes a value to the internal values array. Throws if called after `then`.

#### listener.err(error)

Adds an error to the internal error list. Throws if called after `then`.
