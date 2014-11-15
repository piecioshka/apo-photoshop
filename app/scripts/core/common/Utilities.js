/*global process */

(function (root) {
    'use strict';

    var Utilities = {
        isDarwin: function () {
            return process.platform === 'darwin';
        },

        max: function () {
            var args = Array.prototype.slice.call(arguments);

            // Remove non-numbers elements, ex. all `undefined` values.
            var numbers = args.filter(function (item) {
                return !isNaN(item);
            });

            // Get maximum of numbers list.
            return Math.max.apply(Math, numbers);
        },

        average: function () {
            var args = Array.prototype.slice.call(arguments);

            // Remove non-numbers elements, ex. all `undefined` values.
            var numbers = args.filter(function (item) {
                return !isNaN(item);
            });

            // Calculate summary of all numbers.
            var sum = numbers.reduce(function (mem, item) {
                return mem + (item || 0);
            }, 0);

            // Calculate arithmetic average: sum of all elements by their count.
            return sum / numbers.length;
        }
    };

    // Export `Utilities`.
    return (root.Utilities = Utilities);

}(this));
