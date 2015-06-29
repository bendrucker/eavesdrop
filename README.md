eavesdrop [![Build Status](https://travis-ci.org/bendrucker/eavesdrop.svg)](https://travis-ci.org/bendrucker/eavesdrop)
=========

> Listen on other EventEmitters

## Usage

Listen on all events:

```js
eavesdrop(source, target)
target.on('data', function (arg) {
  // => foo
})
source.emit('data', 'foo')
```

Listen on specific events:

```
eavesdrop(source, target, ['data', 'end'])
target.on('finish', function (arg) {
  // => never called
})
source.emit('finish', 'foo')
```

## API

##### `eavesdrop(source, target, [events])` -> `off`

Listens on source events and re-emits them on the target. If specific events are provided, an array of the registered event listeners is returned. Otherwise, a function is returned that will stop proxying events when called.

##### source

*Required*  
Type: `eventEmitter`

The source emitter that will emit the original events. 

##### target

*Required*  
Type: `eventEmitter`

The target emitter where events will be proxied.

##### events

Type: `array[string]`

An array of events (or variadic arguments) to listen on.

## License

MIT © [Ben Drucker](http://bendrucker.me)
