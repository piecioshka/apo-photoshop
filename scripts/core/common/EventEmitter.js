(function (root) {
    'use strict';

    var EventEmitter = (function () {
        var listeners = [];

        return {
            on: function on(name, fn, ctx) {
                // Push to private lists of listeners.
                listeners.push({
                    name: name,
                    fn: fn,
                    // If the context is not passed, use `this`.
                    ctx: ctx || this
                });
            },

            off: function (name) {
                listeners.forEach(function (listener, index) {
                    if (listener.name === name) {
                        delete listeners[index];
                    }
                });
            },

            emit: function emit(name, params) {
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
