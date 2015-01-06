/*global WeakMap */

(function (root) {
    'use strict';

    var shortcuts = new WeakMap();

    var KeyboardShortcut = {

        handler: function (evt) {
            var shortcut = [];

            if (evt.metaKey) {
                if (root.Utilities.isDarwin()) {
                    shortcut.push('Ctrl');
                } else {
                    shortcut.push('Meta');
                }
            }

            if (evt.ctrlKey) {
                shortcut.push('Ctrl');
            }

            if (evt.shiftKey) {
                shortcut.push('Shift');
            }

            var char = String.fromCharCode(evt.keyCode);
            shortcut.push(char);

            var definedShortcut = shortcuts[shortcut];

            if (definedShortcut) {
                definedShortcut.call();
            }
        },

        add: function (type, callback) {
            var elements = _.map(type.split('-'), function (item) {
                return item.trim();
            });
            shortcuts[elements] = callback;
        }

    };

    // Export `KeyboardShortcut`.
    return (root.KeyboardShortcut = KeyboardShortcut);

}(this));
