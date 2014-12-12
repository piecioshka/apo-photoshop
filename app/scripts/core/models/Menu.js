/*global require */

(function (root) {
    'use strict';

    var path = require('path');
    var gui = require('nw.gui');

    function Menu() {
        this.gui = null;
        this.windowMenu = null;

        this.filesOpenMenuItem = null;
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
        this.operationsOnePointPosterizeMenuItem = null;
        this.operationsOnePointStretchingMenuItem = null;
        this.operationsOnePointBrightnessRegulationMenuItem = null;
        this.operationsOnePointContrastRegulationMenuItem = null;
        this.operationsOnePointGammaRegulationMenuItem = null;

        this.operationsOnePointArithmeticMenuItem = null;
        this.operationsOnePointLogicalMenuItem = null;

        this.operationsNeighbourhoodSmoothingMenuItem = null;
        this.operationsNeighbourhoodSharpenMenuItem = null;
        this.operationsNeighbourhoodEdgeDetectionMenuItem = null;

        this.aboutAuthorsMenuItem = null;
        this.aboutHelpMenuItem = null;

        this.initialize();
        this.setup();
        this.render();
    }

    Menu.prototype.initialize = function () {
        // Set reference to node-webkit gui interface.
        this.gui = gui

        // Create main window menu.
        this.windowMenu = new this.gui.Menu({ type: 'menubar' });

        // If application run under Mac OS must set that option, to fixed main window menu.
        if (root.Utilities.isDarwin()) {
            this.windowMenu.createMacBuiltin(root.locale.get('NAME'), {
                hideEdit: true,
                hideWindow: true
            });
        }
    };

    Menu.prototype.setup = function () {
        this.setupFileMenu();
        this.setupEditMenu();
        this.setupBoxMenu();
        this.setupOperationsMenu();
        this.setupHelpMenu();
    };

    Menu.prototype.render = function () {
        // Assign main menu to window.
        this.gui.Window.get().menu = this.windowMenu;
    };

    Menu.prototype.addSubMenuItem = function (label, callback, modifiers, key) {
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

        return subMenu;
    };

    Menu.prototype.addSeparator = function (menu) {
        var separator = new this.gui.MenuItem({
            type: 'separator'
        });

        menu.append(separator);

        return separator;
    };

    // Setup methods.

    Menu.prototype.setupFileMenu = function () {
        var fileMenu = new this.gui.Menu();

        function openFilHandler() {
            // Load a few images.
            var multipleFile = new root.MultipleFileChooser({
                place: '#app'
            });

            multipleFile.once(root.MultipleFileChooser.EVENTS.LOAD_FILES, function (params) {
                if (params.length === 1) {
                    new root.PictureWindow({
                        picture: params[0]
                    });
                } else {
                    new root.MultiplePicturesWindow({
                        pictures: params
                    });
                }
            });
        }

        function windowCloseHandler() {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow !== null) {
                activeWindow.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: activeWindow });
            }
        }

        this.filesOpenMenuItem = this.addSubMenuItem(root.locale.get('FILES_OPEN'), openFilHandler, 'Ctrl', 'O');
        fileMenu.append(this.filesOpenMenuItem);

        this.fileCloseMenuItem = this.addSubMenuItem(root.locale.get('FILE_CLOSE'), windowCloseHandler, 'Ctrl', 'W');
        fileMenu.append(this.fileCloseMenuItem);

        this.closeMenuItem = this.addSubMenuItem(root.locale.get('CLOSE'), root.close.bind(root), 'Ctrl', 'Q');
        fileMenu.append(this.closeMenuItem);

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('FILE'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.setupEditMenu = function () {
        var fileMenu = new this.gui.Menu();

        this.editRestoreMenuItem = this.addSubMenuItem(root.locale.get('EDIT_RESTORE'), function () {
            var clearTitle;
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof PictureWindow) {
                activeWindow.paintImage();
                clearTitle = activeWindow.getTitle().replace(/\* /, '');
                activeWindow.updateTitle(clearTitle);
            }
        }, 'Ctrl', 'Z');
        fileMenu.append(this.editRestoreMenuItem);

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('EDIT'),
            submenu: fileMenu
        }));
    };

    Menu.prototype.setupBoxMenu = function () {
        var boxMenu = new this.gui.Menu();

        this.boxHistogramMenuItem = this.addSubMenuItem(root.locale.get('BOX_HISTOGRAM'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof PictureWindow) {
                new root.HistogramWindow({
                    picture: activeWindow.settings.picture
                });
            }
        }, 'Ctrl-Shift', 'H');
        boxMenu.append(this.boxHistogramMenuItem);

        this.boxDuplicateMenuItem = this.addSubMenuItem(root.locale.get('BOX_DUPLICATE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof PictureWindow) {
                new root.PictureWindow({
                    picture: activeWindow.settings.picture
                });
            }
        }, 'Ctrl-Shift', 'D');
        boxMenu.append(this.boxDuplicateMenuItem);

        this.boxLutMenuItem = this.addSubMenuItem(root.locale.get('BOX_LUT_UOP'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof PictureWindow) {
                // Save current version.
                var current = activeWindow.settings.picture.canvas;

                // Restore to original version.
                var original = new root.Canvas(activeWindow.settings.picture.canvas.settings);
                original.loadGrayScaleImage(activeWindow.settings.picture.img, activeWindow.settings.picture.width, activeWindow.settings.picture.height);

                new root.LUTUOPWindow({
                    picture: activeWindow.settings.picture,
                    canvas: {
                        current: current,
                        original: original
                    }
                });
            }
        }, 'Ctrl-Shift', 'T');
        boxMenu.append(this.boxLutMenuItem);

        this.windowMenu.append(new this.gui.MenuItem({
            label: root.locale.get('BOX'),
            submenu: boxMenu
        }));
    };

    Menu.prototype.setupOperationsMenu = function () {
        var operationItem = new this.gui.MenuItem({
            label: root.locale.get('OPERATIONS')
        });

        // Wygładzanie histogramu
        // ----------------------

        var flatteningHistogramOperationsMenu = new this.gui.Menu();

        this.operationsFlatteningHistogramMediumMethodMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD'), function () {
            root.OperationsFlatteningHistogram.flatteningHistogramMedium();
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramMediumMethodMenuItem);

        this.operationsFlatteningHistogramRandomMethodMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD'), function () {
            root.OperationsFlatteningHistogram.flatteningHistogramRandom();
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramRandomMethodMenuItem);

        this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD'), function () {
            root.OperationsFlatteningHistogram.flatteningHistogramNeighbourhood();
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem);

        this.operationsFlatteningHistogramCustomMethodMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD'), function () {
            root.OperationsFlatteningHistogram.flatteningHistogramCustom();
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramCustomMethodMenuItem);

        var histogramOperationsMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_FLATTENING_HISTOGRAM'));
        histogramOperationsMenuItem.submenu = flatteningHistogramOperationsMenu;

        // Jednopunktowe
        // -------------

        var onePointOperationsMenu = new this.gui.Menu();

        this.operationsOnePointNegativeMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_NEGATIVE'), function () {
            root.OperationsOnePoint.onePointNegative();
        });
        onePointOperationsMenu.append(this.operationsOnePointNegativeMenuItem);

        this.operationsOnePointThresholdMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_THRESHOLD'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ThresholdTool({
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointThresholdMenuItem);

        this.operationsOnePointPosterizeMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_POSTERIZE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new PosterizeTool({
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointPosterizeMenuItem);

        this.operationsOnePointStretchingMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_STRETCHING'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new StretchTool({
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointStretchingMenuItem);

        this.operationsOnePointBrightnessRegulationMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new BrightnessRegulationTool({
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointBrightnessRegulationMenuItem);

        this.operationsOnePointContrastRegulationMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_CONTRAST_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ContrastRegulationTool({
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointContrastRegulationMenuItem);

        this.operationsOnePointGammaRegulationMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_GAMMA_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new GammaRegulationTool({
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointGammaRegulationMenuItem);

        this.operationsOnePointArithmeticMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_ARITHMETIC'), function () {
            // @type {MultiplePicturesWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ArithmeticalTool({
                pictures: activeWindow.getPictures()
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointArithmeticMenuItem);

        this.operationsOnePointLogicalMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT_LOGICAL'), function () {
            // @type {MultiplePicturesWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new LogicalTool({
                pictures: activeWindow.getPictures()
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointLogicalMenuItem);

        var onePointOperationsMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_ONE_POINT'));
        onePointOperationsMenuItem.submenu = onePointOperationsMenu;

        // Sąsiedztwa
        // ----------

        var neighbourhoodOperationsMenu = new this.gui.Menu();

        this.operationsNeighbourhoodSmoothingMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING'), function () {
            // @type {PictureWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new SmoothingTool({
                picture: activeWindow.settings.picture
            });
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSmoothingMenuItem);

        this.operationsNeighbourhoodSharpenMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN'), function () {
            // @type {PictureWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new SharpenTool({
                picture: activeWindow.settings.picture
            });
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSharpenMenuItem);

        this.operationsNeighbourhoodEdgeDetectionMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_NEIGHBOURHOOD_EDGE_DETECTION'), function () {
            // @type {PictureWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new EdgeDetectionTool({
                picture: activeWindow.settings.picture
            });
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodEdgeDetectionMenuItem);

        var neighbourhoodOperationsMenuItem = this.addSubMenuItem(root.locale.get('OPERATIONS_NEIGHBOURHOOD'));
        neighbourhoodOperationsMenuItem.submenu = neighbourhoodOperationsMenu;

        // ----

        var operationsMenu = new this.gui.Menu();
        operationsMenu.append(histogramOperationsMenuItem);
        operationsMenu.append(onePointOperationsMenuItem);
        operationsMenu.append(neighbourhoodOperationsMenuItem);

        operationItem.submenu = operationsMenu;

        this.windowMenu.append(operationItem);
    };

    Menu.prototype.setupHelpMenu = function () {
        var self = this;
        var helpMenu = new this.gui.Menu();

        this.aboutAuthorsMenuItem = this.addSubMenuItem(root.locale.get('ABOUT_AUTHORS'), function () {
            var lines = [
                root.locale.get('ABOUT_AUTHORS') + ':\n',
                'Piotr Kowalski - piecioshka@gmail.com',
                'Krzysztof Snopkiewicz - k.snopkiewicz@me.com'
            ];
            root.alert(lines.join('\n'));
        });
        helpMenu.append(this.aboutAuthorsMenuItem);

        this.addSeparator(helpMenu);

        this.aboutHelpMenuItem = this.addSubMenuItem(root.locale.get('ABOUT_HELP'), function () {
            self.gui.Shell.openItem(path.join('app', 'docs', 'help.pdf'));
        });
        helpMenu.append(this.aboutHelpMenuItem);

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
