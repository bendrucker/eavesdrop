'use strict'

var toArray = require('to-array')

module.exports = function eavesdrop (source, target, events) {
  if (!isEmitter(source) || !isEmitter(target)) {
    throw new Error('Source and target emitters are required')
  }
  if (arguments.length < 3) {
    return listenAll(source, target)
  }
  if (!Array.isArray(events)) {
    events = toArray(arguments, 2)
  }
  return listen(source, target, events)
}

function listenAll (source, target) {
  var originalEmit = source.emit
  source.emit = function emit (event) {
    var args = [event].concat(toArray(arguments, 1))
    return target.emit.apply(target, args)
  }
  return function off () {
    source.emit = originalEmit
  }
}

function listen (source, target, events) {
  return events.map(function (event) {
    function proxyEvent () {
      var args = [event].concat(toArray(arguments))
      target.emit.apply(target, args)
    }
    source.on(event, proxyEvent)
    return proxyEvent
  })
}

function isEmitter (value) {
  return value && typeof value.emit === 'function'
}
