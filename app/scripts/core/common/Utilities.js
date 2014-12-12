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
        },

        intToByte: function (i) {
            // When value is more than 255, should be equal 255.
            i = (i > 255) ? 255 : i;

            // When value is less than 0, should be equal 0.
            i = (i < 0) ? 0 : i;

            // If is that numbers return them. Otherwise return modify value.
            return i;
        },

        walkTheDOM: function (node, func) {
            func(node);
            node = node.firstChild;

            while (node) {
                this.walkTheDOM(node, func);
                node = node.nextSibling;
            }
        },

        sortNumbers: function (a, b) {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        }

    };

    // Export `Utilities`.
    return (root.Utilities = Utilities);

}(this));
