(function (root) {
    'use strict';

    var cjson = require('cjson');
    var locale = cjson.load('./locale/pl_PL.json');

    function Menu() {
        this.gui = null;
        this.windowMenu = null;

        this.initialize();
    }

    Menu.prototype.initialize = function () {
        // Set reference to node-webkit gui interface.
        this.gui = require('nw.gui');

        // Create main window menu.
        this.windowMenu = new this.gui.Menu({ type: 'menubar' });

        // If application run under Mac OS must set that option, to fixed main window menu.
        if (root.Utilities.isDarwin()) {
            this.windowMenu.createMacBuiltin(locale.NAME, {
                hideEdit: true,
                hideWindow: true
            });
        }

        // Assign main menu to window.
        this.gui.Window.get().menu = this.windowMenu;

        // Create `file` option in main menu.
        this.file();

        // Create `help` option in main menu.
        this.help();
    };

    Menu.prototype.file = function () {
        var self = this;

        // Create file menu.
        var fileMenu = new this.gui.Menu();

        // Append to file menu `open` option.
        fileMenu.append(new this.gui.MenuItem({
            label: locale.FILE_OPEN,
            click: function () {
                self.emit(Menu.EVENTS.FILE_OPEN);
            }
        }));

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: locale.FILE,
            submenu: fileMenu
        }));
    };

    Menu.prototype.help = function () {
        var self = this;

        // Create help menu.
        var helpMenu = new this.gui.Menu();

        // Append to help menu `sample` option.
        helpMenu.append(new this.gui.MenuItem({
            label: locale.SAMPLE,
            click: function () {
                self.emit(Menu.EVENTS.SAMPLE);
            }
        }));

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: locale.ABOUT,
            submenu: helpMenu
        }));
    };

    Menu.EVENTS = {
        FILE_OPEN: 'file:open',
        SAMPLE: 'help:sample'
    };

    // Extend `Menu` module with events.
    _.extend(Menu.prototype, root.EventEmitter);

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
