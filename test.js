'use strict';

require('test-setup');

var EventEmitter = require('events').EventEmitter;
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
      expect(eavesdrop.bind(source, target)).to.throw(/event/);
    });

    it('can register a single events', function () {
      eavesdrop.call(source, target, 'name');
      expect(target.listeners()).to.have.length(1);
    });

    it('can register an array of events', function () {
      eavesdrop.call(source, target, ['name1', 'name2']);
      expect(target.listeners()).to.have.length(2);
    });

    it('can register variadic events', function () {
      eavesdrop.call(source, target, 'name1', 'name2');
      expect(target.listeners()).to.have.length(2);
    });

    it('returns the source for chaining', function () {
      expect(eavesdrop.call(source, target, 'name')).to.equal(source);
    });

  });

  describe('Eavesdropping', function () {

    it('emits all eavesdropped target events on the source', function () {
      var spy = sinon.spy();
      eavesdrop.call(source, target, 'name');
      source.on('name', spy);
      target.emit('name', 'a1', 'a2');
      expect(spy).to.have.been.calledWith('a1', 'a2');
    });

  });

});