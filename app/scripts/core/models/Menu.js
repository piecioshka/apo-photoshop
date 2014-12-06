/*global require */

(function (root) {
    'use strict';

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
        this.gui = require('nw.gui');

        // Create main window menu.
        this.windowMenu = new this.gui.Menu({type: 'menubar'});

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

        function handleLoad(params) {
            if (params.length === 1) {
                new root.PictureWindow({
                    picture: params[0]
                });
            } else {
                new root.MultiplePicturesWindow({
                    pictures: params
                });
            }
        }


        this.filesOpenMenuItem = this.addSubMenuItem(fileMenu, root.locale.get('FILES_OPEN'), function () {
            // Load a few images.
            var multipleFile = new root.MultipleFileChooser({
                place: '#app'
            });

            multipleFile.once(root.MultipleFileChooser.EVENTS.LOAD_FILES, handleLoad);
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
            var clearTitle;
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof PictureWindow) {
                activeWindow.paintImage();
                clearTitle = activeWindow.getTitle().replace(/\* /, '');
                activeWindow.updateTitle(clearTitle);
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

            if (activeWindow instanceof PictureWindow) {
                new root.HistogramWindow({
                    picture: activeWindow.settings.picture
                });
            }
        }, 'Ctrl-Shift', 'H');


        this.boxDuplicateMenuItem = this.addSubMenuItem(boxMenu, root.locale.get('BOX_DUPLICATE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof PictureWindow) {
                new root.PictureWindow({
                    picture: activeWindow.settings.picture
                });
            }
        }, 'Ctrl-Shift', 'D');


        this.boxLutMenuItem = this.addSubMenuItem(boxMenu, root.locale.get('BOX_LUT_UOP'), function () {
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
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ThresholdTool({
                picture: activeWindow.settings.picture
            });
        });

        this.operationsOnePointPosterizeMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_POSTERIZE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new PosterizeTool({
                picture: activeWindow.settings.picture
            });
        });

        this.operationsOnePointStretchingMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_STRETCHING'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new StretchTool({
                picture: activeWindow.settings.picture
            });
        });

        this.operationsOnePointBrightnessRegulationMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new BrightnessRegulationTool({
                picture: activeWindow.settings.picture
            });
        });

        this.operationsOnePointContrastRegulationMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_CONTRAST_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ContrastRegulationTool({
                picture: activeWindow.settings.picture
            });
        });

        this.operationsOnePointGammaRegulationMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_GAMMA_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new GammaRegulationTool({
                picture: activeWindow.settings.picture
            });
        });

        // ---

        this.operationsOnePointArithmeticMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_ARITHMETIC'), function () {
            // @type {MultiplePicturesWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ArithmeticalTool({
                pictures: activeWindow.getPictures()
            });
        });

        this.operationsOnePointLogicalMenuItem = this.addSubMenuItem(onePointOperationsMenu, root.locale.get('OPERATIONS_ONE_POINT_LOGICAL'), function () {
            // @type {MultiplePicturesWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new LogicalTool({
                pictures: activeWindow.getPictures()
            });
        });

        var onePointOperationsMenuItem = this.addSubMenuItem(operationsMenu, root.locale.get('OPERATIONS_ONE_POINT'));
        onePointOperationsMenuItem.submenu = onePointOperationsMenu;

        // Sąsiedztwa
        // ----------

        var neighbourhoodOperationsMenu = new this.gui.Menu();

        this.operationsNeighbourhoodSmoothingMenuItem = this.addSubMenuItem(neighbourhoodOperationsMenu, root.locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING'), function () {
            // @type {PictureWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new SmoothingTool({
                picture: activeWindow.settings.picture
            });
        });


        this.operationsNeighbourhoodSharpenMenuItem = this.addSubMenuItem(neighbourhoodOperationsMenu, root.locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN'), function () {
            // @type {PictureWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new SharpenTool({
                picture: activeWindow.settings.picture
            });
        });


        this.operationsNeighbourhoodEdgeDetectionMenuItem = this.addSubMenuItem(neighbourhoodOperationsMenu, root.locale.get('OPERATIONS_NEIGHBOURHOOD_EDGE_DETECTION'), function () {
            // @type {PictureWindow}
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new EdgeDetectionTool({
                picture: activeWindow.settings.picture
            });
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
        var self = this;
        var helpMenu = new this.gui.Menu();

        this.aboutAuthorsMenuItem = this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_AUTHORS'), function () {
            var lines = [];

            lines.push(root.locale.get('ABOUT_AUTHORS') + ':\n');
            lines.push('Piotr Kowalski - piecioshka@gmail.com');
            lines.push('Krzysztof Snopkiewicz - k.snopkiewicz@me.com');

            root.alert(lines.join('\n'));
        });

        this.addSeparator(helpMenu);

        this.aboutHelpMenuItem = this.addSubMenuItem(helpMenu, root.locale.get('ABOUT_HELP'), function () {
            self.gui.Shell.openItem('./app/docs/help.pdf');
        });

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
