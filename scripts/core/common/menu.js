(function (root) {
    'use strict';

    function Menu() {
        this.gui = null;
        this.windowMenu = null;

        this.initialize();
    }

    Menu.prototype.initialize = function () {
        this.gui = require('nw.gui');

        this.windowMenu = new this.gui.Menu({
            type: 'menubar'
        });

        this.gui.Window.get().menu = this.windowMenu;

        this.file();
        this.help();
    };

    Menu.prototype.file = function () {
        var self = this;
        var fileMenu = new this.gui.Menu();

        this.windowMenu.append(new this.gui.MenuItem({
            label: 'File',
            submenu: fileMenu
        }));

        fileMenu.append(new this.gui.MenuItem({
            label: 'Open',
            click: function () {
                self.emit('file:open');
            }
        }));
    };

    Menu.prototype.help = function () {
        var self = this;
        var helpMenu = new this.gui.Menu();

        this.windowMenu.append(new this.gui.MenuItem({
            label: 'Help',
            submenu: helpMenu
        }));

        helpMenu.append(new this.gui.MenuItem({
            label: 'sample',
            click: function () {
                self.emit('help:sample');
            }
        }));
    };

    // Extend `Menu` module with events.
    _.extend(Menu.prototype, root.EventEmitter);

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
