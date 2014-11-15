/*global process */

(function (root) {
    'use strict';

    var Utilities = {
        isDarwin: function () {
            return process.platform === 'darwin';
        },

        max: function () {
            var args = Array.prototype.slice.call(arguments);
            return Math.max.apply(Math, args.filter(function (val) {
                return !isNaN(val);
            }));
        },

        average: function () {
            var args = Array.prototype.slice.call(arguments);
            var sum = args.reduce(function (mem, item) {
                return mem + (item || 0);
            }, 0);
            return sum / args.length;
        }
    };

    // Export `Utilities`.
    return (root.Utilities = Utilities);

}(this));
