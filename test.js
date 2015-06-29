'use strict'

var test = require('tape')
var EventEmitter = require('events').EventEmitter
var eavesdrop = require('./')

test('all events', function (t) {
  t.plan(6)
  var source = new EventEmitter()
  var target = new EventEmitter()
  var off = eavesdrop(source, target)
  target.on('foo', function ($1, $2) {
    t.equal(this, target)
    t.equal($1, 'bar')
    t.equal($2, 'baz')
  })
  target.on('bar', function ($1, $2) {
    t.equal(this, target)
    t.equal($1, 'baz')
    t.equal($2, 'qux')
  })
  source.emit('foo', 'bar', 'baz')
  source.emit('bar', 'baz', 'qux')
  // restore the original omit method
  off()
  source.emit('foo')
})

test('specific events', function (t) {
  t.plan(6)
  var source = new EventEmitter()
  var target = new EventEmitter()
  var offs = eavesdrop(source, target, 'foo')
  target.on('foo', function ($1, $2) {
    t.equal(this, target)
    t.equal($1, 'bar')
    t.equal($2, 'baz')
  })
  target.on('bar', function ($1, $2) {
    t.equal(this, target)
    t.equal($1, 'baz')
    t.equal($2, 'qux')
  })
  source.emit('foo', 'bar', 'baz')
  // should be a noop, no proxy yet
  source.emit('bar')
  eavesdrop(source, target, 'bar')
  source.emit('bar', 'baz', 'qux')
  // turn off the foo proxy by calling emitter.removeListener with the proxy handler
  source.removeListener('foo', offs[0])
  source.emit('foo')
})
