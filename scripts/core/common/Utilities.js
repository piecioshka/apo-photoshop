(function (root) {
    'use strict';

    var Utilities = {
        isDarwin: function () {
            return process.platform === 'darwin';
        }
    };

    // Export `Utilities`.
    return (root.Utilities = Utilities);

}(this));
