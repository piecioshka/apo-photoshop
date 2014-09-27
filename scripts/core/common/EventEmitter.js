(function (root) {
    'use strict';

    var assert = require('assert');

    var EventEmitter = (function () {
        var listeners = [];

        return {
            on: function on(name, fn, ctx) {
                assert(_.isString(name), 'EventEmitter#on: `name` is not a string');
                assert(_.isFunction(fn), 'EventEmitter#on: `fn` is not a function');

                // Push to private lists of listeners.
                listeners.push({
                    name: name,
                    fn: fn,
                    // If the context is not passed, use `this`.
                    ctx: ctx || this
                });
            },

            once: function (name, fn, ctx) {
                assert(_.isString(name), 'EventEmitter#once: `name` is not a string');
                assert(_.isFunction(fn), 'EventEmitter#once: `fn` is not a function');

                var self = this;
                var handle = function () {
                    fn.apply(ctx, arguments);
                    self.off(name, handle);
                };
                this.on(name, handle, ctx);
            },

            off: function (name, fn) {
                assert(_.isString(name));

                listeners.forEach(function (listener, index) {
                    if (listener.name === name) {
                        if (_.isFunction(fn)) {
                            if (listener.fn === fn) {
                                delete listeners[index];
                            }
                        } else {
                            delete listeners[index];
                        }
                    }
                });
            },

            emit: function emit(name, params) {
                assert(_.isString(name));

                listeners.forEach(function (event) {
                    if (event.name === name) {
                        event.fn.call(event.ctx, params);
                    }
                });
            }
        };
    }());

    // Export `EventEmitter`.
    return (root.EventEmitter = EventEmitter);

}(this));
