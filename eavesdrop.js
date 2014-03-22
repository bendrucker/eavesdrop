'use strict';

var internals = {};

internals.arguments = function (args) {
  return Array.prototype.slice.call(args, 1);
};

internals.events = function (args) {
  var events = internals.arguments(args);
  if (Array.isArray(events[0])) events = events[0];
  internals.requireEvent(events);
  return events;
};

internals.requireEvent = function (events) {
  if (!events.length) throw new Error('Provide 1 or more events to eavesdrop on');
};

internals.dispatch = function (source, target) {
  return function (event) {
    source.on(event, function () {
      var a1 = arguments[0], a2 = arguments[1];
      switch (arguments.length) {
        case 1: target.emit(event, a1); break;
        case 2: target.emit(event, a1, a2); break;
        default: target.emit.apply(target, [event].concat(Array.prototype.slice.call(arguments)));
      }
    });
  };
};

module.exports = function (source) {
  var target = this;
  internals.events(arguments)
    .forEach(internals.dispatch(source, target));
  return target;
};