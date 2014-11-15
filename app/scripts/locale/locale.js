(function (root) {
    'use strict';

    var locale = (root.locale = root.locale || {});

    locale.__name__ = 'pl_PL';

    locale.get = function (key) {
        return locale[locale.__name__][key];
    };

}(this));
