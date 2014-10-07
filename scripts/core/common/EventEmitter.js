(function (root) {
    'use strict';

    var assert = require('assert');

    var EventEmitter = {
        on: function on(name, fn, ctx) {
            assert(_.isString(name), 'EventEmitter#on: `name` is not a string');
            assert(_.isFunction(fn), 'EventEmitter#on: `fn` is not a function');

            if (!_.isArray(this._listeners)) {
                this._listeners = [];
            }

            // Push to private lists of listeners.
            this._listeners.push({
                name: name,
                fn: fn,
                // If the context is not passed, use `this`.
                ctx: ctx || this
            });
        },

        once: function (name, fn, ctx) {
            assert(_.isString(name), 'EventEmitter#once: `name` is not a string');
            assert(_.isFunction(fn), 'EventEmitter#once: `fn` is not a function');
            ctx = ctx || this;

            var self = this;
            var handle = function () {
                fn.apply(ctx, arguments);
                self.off(name, handle);
            };
            this.on(name, handle, ctx);
        },

        off: function (name, fn) {
            assert(_.isString(name));

            if (!_.isArray(this._listeners)) {
                this._listeners = [];
            }

            this._listeners.forEach(function (listener, index) {
                if (listener.name === name) {
                    if (_.isFunction(fn)) {
                        if (listener.fn === fn) {
                            this._listeners.splice(index, 1);
                        }
                    } else {
                        this._listeners.splice(index, 1);
                    }
                }
            }, this);
        },

        emit: function emit(name, params) {
            assert(_.isString(name));

            if (!_.isArray(this._listeners)) {
                this._listeners = [];
            }

            this._listeners.forEach(function (event) {
                if (event.name === name) {
                    event.fn.call(event.ctx, params);
                }
            });
        }
    };

    // Export `EventEmitter`.
    return (root.EventEmitter = EventEmitter);

}(this));
