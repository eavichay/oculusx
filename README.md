# oculus-X

Easy javascript object observing for browser and node
> Oculus is a latin word for *eye* or *sight*

### Watching

```javascript

import { watch } from 'oculusx';

const appData = {
    // empty state at first, but it can be a fully populated object
};

watch(appData)
    ('user.name', (value) => {
        // do something when the name changes
    })
    ('user', (value) => {
        // do something when the whole user object changes
        // subscription to name remains even if the user is a whole new object and will be invoked
    });

appData.user = {
    name: 'John Doe' // both wathcers are inboked
};

appData.user.name = 'Jane Doe'; // user.name watcher is invoked

appData.user = undefined; // both watchers are invoked

appData.user = {
    name: 'Jordan Doe' // user.name is still intact and both watchers will be invoked.
};
```

### Unwatching a specific callback

```javascript
import { watch, unwatch } from 'oculusx'

const handler_1 = (value) => {
    // do something
};

const handler_2 = (value) => {
    // do something
};

watch(appData)
    ('user.name', handler_1)
    ('user.name', handler_2);

unwatch(appData)('user.name', handler_1);

appData.user = {
    name: 'Jaquelin Doe' // only handler_2 is invoked
};
```

### Unwatching all callbacks from a specific path

```javascript
import { watch, unwatch } from 'oculusx';

watch(appData)
    ('user', () => { /* do something useful */ }) // callback #1
    ('user', () => { /* do something useful */ }) // callback #2
    ('user.name', () => { /* do something useful */ }); // watch user.name

unwatch(appData)('user'); // removes all user object watchers

appData.user.name = 'James Doe'; // user.name watcher is invoked
appData.user = {
    name: 'Jimmy Doe' // Only user.name watcher is invoked
};

```

### Immediate invocation
```javascript

watch(target)(path, callback, true);

```

### Alternative syntax
For those who dislike currying syntax:
```javascript
watch(target)
    (path, callback)
    (path2, callback2);

// equals
watch(target, path, callback);
watch(target, path2, callback2);

// or
watch(target, path, callback)
    (path2, callback2);
```
It also works the same for `unwatch`.


## Future releases
- Unwatching all nested pathes: `unwatch(target)('some.path.*');`
- Unwatching all pathes from an object: `unwatch(target, '*');`
- Watching arrays. Currently partially working only when shift/unshift are invoked or the whole array is replaced
- Documentation

### Installation
`npm i oculusx`
`yarn add oculusx`
