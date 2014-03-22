eavesdrop [![Build Status](https://travis-ci.org/valet-io/eavesdrop.svg)](https://travis-ci.org/valet-io/eavesdrop)
=========

Listen on other EventEmitters.

### Usage
```js
eavesdrop.call(target, source, 'event');
eavesdrop.call(target, source, 'event1', 'event2');
eavesdrop.call(target, source, ['event1', 'event2']);
```

The `target` (`this` value) will now receive all registered events when emitted on the `source`. `eavesdrop` return the `this` value of the call.

```js
eavesdrop
  .call(target, source)
  .on('event', function () {
    console.log('i spy an event');
  });

source.emit('event'); // => logged: 'i spy an event'
```