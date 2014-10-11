'use strict';

var EventEmitter = require('events').EventEmitter;
var expect       = require('chai').use(require('sinon-chai')).expect;
var sinon        = require('sinon');
var eavesdrop    = require('./');

/* globals describe:false, it:false, beforeEach:false, expect:false, sinon:false */

describe('eavesdrop', function () {

  var source, target;
  beforeEach(function () {
    source = new EventEmitter();
    target = new EventEmitter();
  });

  describe('Registering listeners', function () {

    it('must specify 1+ events', function () {
      expect(eavesdrop.bind(target, source)).to.throw(/events/);
    });

    it('can register a single event', function () {
      eavesdrop.call(target, source, 'name');
      expect(source.listeners('name')).to.have.length(1);
    });

    it('can register an array of events', function () {
      eavesdrop.call(target, source, ['name1', 'name2']);
      expect(source.listeners('name1')).to.have.length(1);
      expect(source.listeners('name2')).to.have.length(1);
    });

    it('can register variadic events', function () {
      eavesdrop.call(target, source, 'name1', 'name2');
      expect(source.listeners('name1')).to.have.length(1);
      expect(source.listeners('name2')).to.have.length(1);
    });

    it('can register using a custom config object', function () {
      eavesdrop.call(target, source, {
        events: 'name'
      });
      eavesdrop.call(target, source, {
        events: ['name', 'name']
      });
      expect(source.listeners('name')).to.have.length(3);
    });

    it('returns the target for chaining', function () {
      expect(eavesdrop.call(target, source, 'name')).to.equal(target);
    });

  });

  describe('Eavesdropping', function () {

    var spy;
    beforeEach(function () {
      spy = sinon.spy();
    });

    it('emits all eavesdropped source events on the target', function () {
      eavesdrop.call(target, source, 'name');
      target.on('name', spy);
      source.emit('name', 'a1');
      source.emit('name', 'a1', 'a2', 'a3', 'a4');
      expect(spy).to.have.been.calledWith('a1');
      expect(spy).to.have.been.calledWith('a1', 'a2', 'a3', 'a4');
      expect(spy).to.have.been.always.calledOn(target);
    });

    it('calls a custom trigger method if registered', function () {
      eavesdrop.call(target, source, {
        method: 'emitThen',
        events: 'name'
      });
      target.emitThen = sinon.spy();
      source.emit('name', 'a1');
      expect(target.emitThen).to.have.been.calledWith('name', 'a1');
      expect(target.emitThen).to.have.been.calledOn(target);
    });

  });

});
