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
        }
    };

    // Export `Utilities`.
    return (root.Utilities = Utilities);

}(this));
