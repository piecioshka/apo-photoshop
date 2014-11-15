/*global require */

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
        this.setupEditMenu();
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

        this.addSubMenuItem(fileMenu, root.locale.get('CLOSE'), function () {
            self.emit(Menu.EVENTS.CLOSE);
        }, 'Ctrl', 'Q');

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('FILE'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.setupEditMenu = function () {
        var self = this;
        var fileMenu = new this.gui.Menu();

        this.addSubMenuItem(fileMenu, root.locale.get('EDIT_RESTORE'), function () {
            self.emit(Menu.EVENTS.EDIT_RESTORE);
        }, 'Ctrl', 'Z');

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('EDIT'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.setupBoxMenu = function () {
        var self = this;
        var boxMenu = new this.gui.Menu();

        this.addSubMenuItem(boxMenu, root.locale.get('BOX_HISTOGRAM'), function () {
            self.emit(Menu.EVENTS.BOX_HISTOGRAM);
        }, 'Ctrl-Shift', 'H');

        this.addSubMenuItem(boxMenu, root.locale.get('BOX_DUPLICATE'), function () {
            self.emit(Menu.EVENTS.BOX_DUPLICATE);
        }, 'Ctrl-Shift', 'D');

        this.addSubMenuItem(boxMenu, root.locale.get('BOX_LUT'), function () {
            self.emit(Menu.EVENTS.BOX_LUT);
        }, 'Ctrl-Shift', 'T');

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('BOX'),
            submenu: boxMenu
        }));
    };

    Menu.prototype.setupOperationsMenu = function () {
        var self = this;
        var operationsMenu = new this.gui.Menu();

        // Wygładzanie histogramu
        // ----------------------

        var flatteningHistogramOperationsMenu = new this.gui.Menu();

        var histogramOperationsMenuItem = this.addSubMenuItem(operationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM'));
        histogramOperationsMenuItem.submenu = flatteningHistogramOperationsMenu;

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

        // Jednopunktowe
        // -------------

        var onePointOperationsMenu = new this.gui.Menu();

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_NEGATIVE'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_NEGATIVE);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_THRESHOLD'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_THRESHOLD);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_INVERSE_THRESHOLD'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_INVERSE_THRESHOLD);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_THRESHOLD_RANGES'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_THRESHOLD_RANGES);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_THRESHOLD_WITH_GRAY_SCALES'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_THRESHOLD_WITH_GRAY_SCALES);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_STRETCHING'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_STRETCHING);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_REDUCTION_GRAY_SCALE'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_REDUCTION_GRAY_SCALE);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_CONTRAST_REGULATION'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_CONTRAST_REGULATION);
        });

        this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_GAMMA_REGULATION'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_GAMMA_REGULATION);
        });

        var onePointOperationsMenuItem = this.addSubMenuItem(operationsMenu, root.locale.get('OPERATIONS_ONE_POINT'));
        onePointOperationsMenuItem.submenu = onePointOperationsMenu;

        // Sąsiedztwa
        // ----------

        var neighbourhoodOperationsMenu = new this.gui.Menu();

        this.addSubMenuItem(neighbourhoodOperationsMenu, root.locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING'), function () {
            self.emit(Menu.EVENTS.OPERATIONS_ONE_POINT_NEGATIVE);
        });

        var neighbourhoodOperationsMenuItem = this.addSubMenuItem(operationsMenu, root.locale.get('OPERATIONS_NEIGHBOURHOOD'));
        neighbourhoodOperationsMenuItem.submenu = neighbourhoodOperationsMenu;

        // ----

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('OPERATIONS'),
            submenu: operationsMenu
        }));
    };

    Menu.prototype.setupHelpMenu = function () {
        var helpMenu = new this.gui.Menu();

        this.addSeparator(helpMenu);

        this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_AUTHORS'), function () {
            var lines = [];

            lines.push(root.locale.get('ABOUT_AUTHORS') + ':\n-------\n');
            lines.push('Piotr Kowalski - piecioshka@gmail.com');
            lines.push('Krzysztof Snopkiewicz - k.snopkiewicz@me.com');

            root.alert(lines.join('\n\n'));
        });

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('ABOUT'),
            submenu: helpMenu
        }));
    };

    Menu.EVENTS = {
        FILE_OPEN: 'file-open',
        FILE_CLOSE: 'file-close',
        CLOSE: 'close',

        EDIT_BACK: 'edit-back',
        EDIT_RESTORE: 'edit-restore',

        BOX_HISTOGRAM: 'box-histogram',
        BOX_DUPLICATE: 'box-duplicate',
        BOX_LUT: 'box-lut',

        OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD: 'operation-flattening-histogram-medium-method',
        OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD: 'operation-flattening-histogram-random-method',
        OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD: 'operation-flattening-histogram-neighbourhood-method',
        OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD: 'operation-flattening-histogram-custom-method',

        OPERATIONS_COLORS_GREEN: 'operation-colors-green',

        OPERATIONS_ONE_POINT_NEGATIVE: 'operation-one-point-negative',
        OPERATIONS_ONE_POINT_THRESHOLD: 'operation-one-point-threshold',
        OPERATIONS_ONE_POINT_INVERSE_THRESHOLD: 'operation-one-point-inverse-threshold',
        OPERATIONS_ONE_POINT_THRESHOLD_RANGES: 'operation-one-point-threshold-ranges',
        OPERATIONS_ONE_POINT_THRESHOLD_WITH_GRAY_SCALES: 'operation-one-point-threshold-with-gray-scales',
        OPERATIONS_ONE_POINT_STRETCHING: 'operation-one-point-stretching',
        OPERATIONS_ONE_POINT_REDUCTION_GRAY_SCALE: 'operation-one-point-reduction-gray-scale',
        OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION: 'operation-one-point-brightness-regulation',
        OPERATIONS_ONE_POINT_CONTRAST_REGULATION: 'operation-one-point-contrast-regulation',
        OPERATIONS_ONE_POINT_GAMMA_REGULATION: 'operation-one-point-gamma-regulation',

        OPERATIONS_NEIGHBOURHOOD: 'operation-neighbourhood',
        OPERATIONS_NEIGHBOURHOOD_SMOOTHING: 'operation-neighbourhood'
    };

    // Extend `Menu` module with events.
    _.extend(Menu.prototype, root.EventEmitter);

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
