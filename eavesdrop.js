'use strict';

var internals = {};

internals.arguments = function (args) {
  return Array.prototype.slice.call(args, 1);
};

internals.events = function (options, args) {
  var events;
  if (options) {
    events = options.events;
    if (!Array.isArray(events)) events = [events];
  } else {
    events = internals.arguments(args);
    if (Array.isArray(events[0])) events = events[0];
  }
  internals.requireEvent(events);
  return events;
};

internals.requireEvent = function (events) {
  if (!events.length) throw new Error('Provide 1 or more events to eavesdrop on');
};

internals.options = function (options) {
  if (typeof options === 'string' || Array.isArray(options)) return null;
  return options;
};

internals.dispatch = function (source, target, options) {
  return function (event) {
    source.on(event, function () {
      var a1 = arguments[0], a2 = arguments[1];
      var method = options && options.method || 'emit';
      switch (arguments.length) {
        case 1: return target[method](event, a1); break;
        case 2: return target[method](event, a1, a2); break;
        default: return target[method].apply(target, [event].concat(Array.prototype.slice.call(arguments)));
      }
    });
  };
};

module.exports = function (source, options) {
  var target = this;
  options = internals.options(options);
  internals.events(options, arguments)
    .forEach(internals.dispatch(source, target, options));
  return target;
};