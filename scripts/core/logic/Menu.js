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

        this.setupFileMenu();
        this.setupBoxMenu();
        this.setupOperationsMenu();
        this.setupHelpMenu();
    };

    Menu.prototype.addSubMenuItem = function (menu, label, callback, modifiers, key) {
        if (_.isString(modifiers) && _.isString(key)) {
            root.KeyboardShortcut.add(modifiers + '-' + key, callback);
        }

        var subMenu = new this.gui.MenuItem({
            type: 'normal',
            label: label,
            key: key,
            modifiers: modifiers
        });

        if (_.isFunction(callback)) {
            subMenu.on('click', callback);
        }

        menu.append(subMenu);

        return subMenu;
    };

    Menu.prototype.addSeparator = function (menu) {
        var separator = new this.gui.MenuItem({
            type: 'separator'
        });

        menu.append(separator);

        return separator;
    };

    Menu.prototype.setupFileMenu = function () {
        var self = this;
        var fileMenu = new this.gui.Menu();

        this.addSubMenuItem(fileMenu, root.locale.get('FILE_OPEN'), function () {
            self.emit(Menu.EVENTS.FILE_OPEN);
        }, 'Ctrl', 'O');

        this.addSubMenuItem(fileMenu, root.locale.get('FILE_CLOSE'), function () {
            self.emit(Menu.EVENTS.FILE_CLOSE);
        }, 'Ctrl', 'W');

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('FILE'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.setupBoxMenu = function () {
        var self = this;
        var boxMenu = new this.gui.Menu();

        this.addSubMenuItem(boxMenu, root.locale.get('BOX_HISTOGRAM'), function () {
            self.emit(Menu.EVENTS.BOX_HISTOGRAM);
        }, 'Ctrl-Shift', 'H');

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('BOX'),
            submenu: boxMenu
        }));
    };

    Menu.prototype.setupOperationsMenu = function () {
        var self = this;
        var operationsMenu = new this.gui.Menu();
        var flatteningHistogramOperationsMenu = new this.gui.Menu();

        this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD);
        });

        this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD);
        });

        this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD);
        });

        this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD);
        });

        var histogramOperationsMenuItem = this.addSubMenuItem(operationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM'));
        histogramOperationsMenuItem.submenu = flatteningHistogramOperationsMenu;

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('OPERATIONS'),
            submenu: operationsMenu
        }));
    };

    Menu.prototype.setupHelpMenu = function () {
        var self = this;
        var helpMenu = new this.gui.Menu();

        this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_SAMPLE'), function () {
            self.emit(Menu.EVENTS.SAMPLE);
        }, 'Ctrl-Shift', 'S');

        this.addSeparator(helpMenu);

        this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_AUTHORS'), function () {
            var lines = [];
            lines.push('Autorzy:\n-------\n');
            lines.push('Piotr Kowalski <piecioshka@gmail.com> @piecioshka');
            lines.push('Krzysztof Snopkiewicz <k.snopkiewicz@me.com> @ikris77');

            root.alert(lines.join('\n\n'));
        });

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('ABOUT'),
            submenu: helpMenu
        }));
    };

    Menu.EVENTS = {
        FILE_OPEN: 'open',
        FILE_CLOSE: 'close',
        BOX_HISTOGRAM: 'histogram',
        OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD: 'operation-flattening-histogram-medium-method',
        OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD: 'operation-flattening-histogram-random-method',
        OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD: 'operation-flattening-histogram-neighbourhood-method',
        OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD: 'operation-flattening-histogram-custom-method',
        SAMPLE: 'sample'
    };

    // Extend `Menu` module with events.
    _.extend(Menu.prototype, root.EventEmitter);

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
