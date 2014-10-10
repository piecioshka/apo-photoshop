(function (root) {
    'use strict';

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
            this.windowMenu.createMacBuiltin(root.locale.get('NAME'), {
                hideEdit: true,
                hideWindow: true
            });
        }

        // Assign main menu to window.
        this.gui.Window.get().menu = this.windowMenu;

        // Create `file` option in main menu.
        this.file();

        // Create `box` option in main menu.
        this.box();

        // Create `operations` option in main menu.
        this.operations();

        // Create `help` option in main menu.
        this.help();
    };

    Menu.prototype.addSubMenuItem = function (menu, label, callback, shortcut) {
        if (_.isString(shortcut)) {
            root.KeyboardShortcut.add(shortcut, callback);
        }

        var subMenu = new this.gui.MenuItem({
            label: label + (shortcut ? ' ' + shortcut : ''),
            click: callback
        });

        menu.append(subMenu);

        return subMenu;
    };

    Menu.prototype.file = function () {
        var self = this;
        // Create file menu.
        var fileMenu = new this.gui.Menu();

        // Add open file option.
        this.addSubMenuItem(fileMenu, root.locale.get('FILE_OPEN'), function () {
            self.emit(Menu.EVENTS.FILE_OPEN);
        }, 'Ctrl+O');

        // Add close file option.
        this.addSubMenuItem(fileMenu, root.locale.get('FILE_CLOSE'), function () {
            self.emit(Menu.EVENTS.FILE_CLOSE);
        }, 'Ctrl+W');

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('FILE'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.box = function () {
        var self = this;
        // Create file menu.
        var boxMenu = new this.gui.Menu();

        // Add histogram option.
        this.addSubMenuItem(boxMenu, root.locale.get('BOX_HISTOGRAM'), function () {
            self.emit(Menu.EVENTS.BOX_HISTOGRAM);
        }, 'Ctrl+Shift+H');

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('BOX'),
            submenu: boxMenu
        }));
    };

    Menu.prototype.operations = function () {
        var self = this;
        // Create file menu.
        var boxMenu = new this.gui.Menu();

        // Add histogram option.
        this.addSubMenuItem(boxMenu, root.locale.get('OPERATIONS_HISTOGRAM'), function () {
            self.emit(Menu.EVENTS.BOX_HISTOGRAM);
        });

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('OPERATIONS'),
            submenu: boxMenu
        }));
    };

    Menu.prototype.help = function () {
        var self = this;
        // Create help menu.
        var helpMenu = new this.gui.Menu();

        // Add sample option.
        this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_SAMPLE'), function () {
            self.emit(Menu.EVENTS.SAMPLE);
        }, 'Ctrl+Shift+S');
        // Add authors option.
        this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_AUTHORS'), function () {
            var lines = [];
            lines.push('Autorzy:\n-------\n');
            lines.push('Piotr Kowalski <piecioshka@gmail.com> @piecioshka');
            lines.push('Krzysztof Snopkiewicz <k.snopkiewicz@me.com> @ikris77');

            root.alert(lines.join('\n\n'));
        });

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('ABOUT'),
            submenu: helpMenu
        }));
    };

    Menu.EVENTS = {
        FILE_OPEN: 'open',
        FILE_CLOSE: 'close',
        BOX_HISTOGRAM: 'histogram',
        SAMPLE: 'sample'
    };

    // Extend `Menu` module with events.
    _.extend(Menu.prototype, root.EventEmitter);

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
