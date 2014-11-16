/*global require */

(function (root) {
    'use strict';

    function Menu() {
        this.gui = null;
        this.windowMenu = null;

        this.fileOpenMenuItem = null;
        this.fileCloseMenuItem = null;
        this.closeMenuItem = null;

        this.editRestoreMenuItem = null;

        this.boxHistogramMenuItem = null;
        this.boxDuplicateMenuItem = null;
        this.boxLutMenuItem = null;

        this.operationsFlatteningHistogramMediumMethodMenuItem = null;
        this.operationsFlatteningHistogramRandomMethodMenuItem = null;
        this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem = null;
        this.operationsFlatteningHistogramCustomMethodMenuItem = null;

        this.operationsOnePointNegativeMenuItem = null;
        this.operationsOnePointThresholdMenuItem = null;
        this.operationsOnePointReductionGrayScaleMenuItem = null;
        this.operationsOnePointStretchingMenuItem = null;
        this.operationsOnePointBrightnessRegulationMenuItem = null;
        this.operationsOnePointContrastRegulationMenuItem = null;
        this.operationsOnePointGammaRegulationMenuItem = null;

        this.operationsNeighbourhoodSmoothingMenuItem = null;

        this.aboutAuthorsMenuItem = null;
        this.aboutHelpMenuItem = null;

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
        var fileMenu = new this.gui.Menu();

        this.fileOpenMenuItem = this.addSubMenuItem(fileMenu, root.locale.get('FILE_OPEN'), function () {

            var file = new root.FileChooser({
                place: '#app'
            });

            file.once(root.FileChooser.EVENTS.SELECT_FILE, function (params) {
                // Listen for load image from user.
                root.AssetsLoader.once(root.AssetsLoader.EVENTS.IMAGE_LOADED, function (image) {
                    new root.PictureWindow({
                        image: image
                    });
                });

                // Loading choose file.
                root.AssetsLoader.loadImage(params.file, params.name);
            });
        }, 'Ctrl', 'O');

        this.fileCloseMenuItem = this.addSubMenuItem(fileMenu, root.locale.get('FILE_CLOSE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow !== null) {
                activeWindow.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: activeWindow });
            }
        }, 'Ctrl', 'W');

        this.closeMenuItem = this.addSubMenuItem(fileMenu, root.locale.get('CLOSE'), function () {
            // Close program.
            root.close();
        }, 'Ctrl', 'Q');

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('FILE'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.setupEditMenu = function () {
        var fileMenu = new this.gui.Menu();

        this.editRestoreMenuItem = this.addSubMenuItem(fileMenu, root.locale.get('EDIT_RESTORE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow !== null) {
                activeWindow.buildImage();
                activeWindow.updateTitle(activeWindow.getTitle().replace(/\* /, ''));
            }
        }, 'Ctrl', 'Z');

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('EDIT'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.setupBoxMenu = function () {
        var boxMenu = new this.gui.Menu();

        this.boxHistogramMenuItem = this.addSubMenuItem(boxMenu, root.locale.get('BOX_HISTOGRAM'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow !== null) {
                new root.HistogramWindow({
                    image: activeWindow.settings.image,
                    canvas: activeWindow.canvas
                });
            }
        }, 'Ctrl-Shift', 'H');


        this.boxDuplicateMenuItem = this.addSubMenuItem(boxMenu, root.locale.get('BOX_DUPLICATE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow !== null) {
                new root.PictureWindow({
                    image: activeWindow.settings.image
                });
            }
        }, 'Ctrl-Shift', 'D');


        this.boxLutMenuItem = this.addSubMenuItem(boxMenu, root.locale.get('BOX_LUT'), function () {
            // TODO(piecioshka): LUT
        }, 'Ctrl-Shift', 'T');


        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('BOX'),
            submenu: boxMenu
        }));
    };

    Menu.prototype.setupOperationsMenu = function () {
        var operationsMenu = new this.gui.Menu();

        // Wygładzanie histogramu
        // ----------------------

        var flatteningHistogramOperationsMenu = new this.gui.Menu();

        var histogramOperationsMenuItem = this.addSubMenuItem(operationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM'));
        histogramOperationsMenuItem.submenu = flatteningHistogramOperationsMenu;

        this.operationsFlatteningHistogramMediumMethodMenuItem = this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD'), function () {
            root.OperationFlatteningHistogram.flatteningHistogramMedium();
        });

        this.operationsFlatteningHistogramRandomMethodMenuItem = this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD'), function () {
            root.OperationFlatteningHistogram.flatteningHistogramRandom();
        });

        this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem = this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD'), function () {
            root.OperationFlatteningHistogram.flatteningHistogramNeighbourhood();
        });

        this.operationsFlatteningHistogramCustomMethodMenuItem = this.addSubMenuItem(flatteningHistogramOperationsMenu, root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD'), function () {
            root.OperationFlatteningHistogram.flatteningHistogramCustom();
        });

        // Jednopunktowe
        // -------------

        var onePointOperationsMenu = new this.gui.Menu();

        this.operationsOnePointNegativeMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_NEGATIVE'), function () {
            root.OperationOnePoint.onePointNegative();
        });

        this.operationsOnePointThresholdMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_THRESHOLD'), function () {
            root.OperationOnePoint.onePointThreshold();
        });

        this.operationsOnePointReductionGrayScaleMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_REDUCTION_GRAY_SCALE'), function () {
            root.OperationOnePoint.onePointReductionGrayScale();
        });

        this.operationsOnePointStretchingMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_STRETCHING'), function () {
            root.OperationOnePoint.onePointStretching();
        });

        this.operationsOnePointBrightnessRegulationMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION'), function () {
            root.OperationOnePoint.onePointBrightnessRegulation();
        });

        this.operationsOnePointContrastRegulationMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_CONTRAST_REGULATION'), function () {
            root.OperationOnePoint.onePointContrastRegulation();
        });

        this.operationsOnePointGammaRegulationMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_GAMMA_REGULATION'), function () {
            root.OperationOnePoint.onePointGammaRegulation();
        });

        var onePointOperationsMenuItem = this.addSubMenuItem(operationsMenu, root.locale.get('OPERATIONS_ONE_POINT'));
        onePointOperationsMenuItem.submenu = onePointOperationsMenu;

        // Sąsiedztwa
        // ----------

        var neighbourhoodOperationsMenu = new this.gui.Menu();

        this.operationsNeighbourhoodSmoothingMenuItem = this.addSubMenuItem(neighbourhoodOperationsMenu, root.locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING'), function () {
            // TODO(piecioshka): fill it
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

        this.aboutAuthorsMenuItem = this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_AUTHORS'), function () {
            var lines = [];

            lines.push(root.locale.get('ABOUT_AUTHORS') + ':\n');
            lines.push('Piotr Kowalski - piecioshka@gmail.com');
            lines.push('Krzysztof Snopkiewicz - k.snopkiewicz@me.com');

            root.alert(lines.join('\n'));
        });

        this.addSeparator(helpMenu);

        this.aboutHelpMenuItem = this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_HELP'));

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('ABOUT'),
            submenu: helpMenu
        }));
    };

    // Extend `Menu` module with events.
    _.extend(Menu.prototype, root.EventEmitter);

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
