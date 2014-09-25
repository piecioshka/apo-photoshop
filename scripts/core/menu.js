(function (root) {
    'use strict';

    var EventEmitter = require('events');

    function Menu() {
        var self = this;
        var nw = require('nw.gui');

        var windowMenu = new nw.Menu({
            type: 'menubar'
        });

        nw.Window.get().menu = windowMenu;

        var helpMenu = new nw.Menu();

        windowMenu.append(new nw.MenuItem({
            label: 'Help',
            submenu: helpMenu
        }));

        helpMenu.append(new nw.MenuItem({
            label: 'sample',
            click: function () {
                self.emit('sample');
            }
        }));
    }

    // Extend `Menu` module with events.
    Menu.prototype = new EventEmitter();

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
