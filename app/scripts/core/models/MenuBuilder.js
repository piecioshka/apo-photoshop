/*global require */

(function (root) {
    'use strict';

    var path = require('path');
    var gui = require('nw.gui');

    function MenuBuilder() {
        this.windowMenu = null;

        this.filesOpenMenuItem = null;
        this.fileSaveMenuItem = null;
        this.fileCloseMenuItem = null;
        this.closeMenuItem = null;

        this.editRestoreMenuItem = null;

        this.toolsDuplicateMenuItem = null;
        this.toolsLutMenuItem = null;
        this.toolsUOPMenuItem = null;

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

        this.operationsOnePointArithmeticalLogicalMenuItem = null;

        this.operationsNeighbourhoodSmoothingMenuItem = null;
        this.operationsNeighbourhoodSharpenMediumMenuItem = null;
        this.operationsNeighbourhoodSharpenMinimalMenuItem = null;
        this.operationsNeighbourhoodSharpenMaximalMenuItem = null;

        this.morphologicalOperationsMenuItem = null;
        this.turtleOperationsMenuItem = null;

        this.aboutAuthorsMenuItem = null;
        this.aboutHelpMenuItem = null;

        this.initialize();
        this.setup();
        this.render();
    }

    MenuBuilder.prototype.initialize = function () {
        // Create main window menu.
        this.windowMenu = new gui.Menu({ type: 'menubar' });

        // If application run under Mac OS must set that option, to fixed main window menu.
        if (root.Utilities.isDarwin()) {
            this.windowMenu.createMacBuiltin(root.Locale.get('NAME'), {
                hideEdit: true,
                hideWindow: true
            });
        }
    };

    MenuBuilder.prototype.setup = function () {
        this.setupFileMenu();
        this.setupEditMenu();
        this.setupBoxMenu();
        this.setupOperationsMenu();
        this.setupHelpMenu();
    };

    MenuBuilder.prototype.render = function () {
        // Assign main menu to window.
        gui.Window.get().menu = this.windowMenu;
    };

    MenuBuilder.prototype.addMenuItem = function (label, callback, modifiers, key) {
        if (_.isString(modifiers) && _.isString(key)) {
            root.KeyboardShortcut.add(modifiers + '-' + key, callback);
        }

        var subMenu = new gui.MenuItem({
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

    MenuBuilder.prototype.addSeparator = function (menu) {
        var separator = new gui.MenuItem({
            type: 'separator'
        });

        menu.append(separator);

        return separator;
    };

    // Setup methods.

    MenuBuilder.prototype.setupFileMenu = function () {
        var fileMenu = new gui.Menu();

        function validateParams(params) {
            var i, j, name, ext;
            var names = _.pluck(params, 'name');
            var unsupported = root.AssetsLoader.UNSUPPORTED_EXTENSIONS;

            for (i = 0; i < names.length; i++) {
                name = names[i];

                for (j = 0; j < unsupported.length; j++) {
                    ext = unsupported[j];

                    if (ext.test(name)) {
                        return false;
                    }
                }
            }

            return true;
        }

        function buildCanvasFromImage(image) {
            var canvas = new root.Canvas({
                width: image.width,
                height: image.height
            });
            canvas.$canvas.classList.add('canvas-picture');
            canvas.loadGrayScaleImage(image.img, image.width, image.height);
            return canvas;
        }

        function loadImages(params, callback) {
            var picturesLoaders = [];

            // Loop through each of file (images).
            _.each(params, function (image, index) {
                picturesLoaders.push(function () {
                    var p = new root.promise.Promise();

                    // Load selected file.
                    root.AssetsLoader.loadImage(image.file, image.name, function (file) {
                        params[index].canvas = buildCanvasFromImage(file);
                        _.extend(params[index], file);
                        p.done();
                    });

                    return p;
                });
            });

            root.promise.chain(picturesLoaders).then(callback);
        }

        function openFilHandler() {
            var multipleFile = new root.FileOpenHelper();

            multipleFile.once(root.AbstractFileHelper.EVENTS.LOAD_FILES, function (params) {
                if (!validateParams(params)) {
                    root.alert(root.Locale.get('MSG_ERR_UNSUPPORTED'));
                    return;
                }

                loadImages(params, function () {
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
            });
        }

        function saveFileHandler() {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                activeWindow.saveAsPicture();
            }
        }

        function windowCloseHandler() {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow !== null) {
                activeWindow.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: activeWindow });
            }
        }

        // -------------------------------------------------------------------------------------------------------------

        this.filesOpenMenuItem = this.addMenuItem(root.Locale.get('FILES_OPEN'), openFilHandler, 'Ctrl', 'O');
        fileMenu.append(this.filesOpenMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.fileSaveMenuItem = this.addMenuItem(root.Locale.get('FILE_SAVE_AS'), saveFileHandler, 'Ctrl-Shift', 'S');
        fileMenu.append(this.fileSaveMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.fileCloseMenuItem = this.addMenuItem(root.Locale.get('FILE_CLOSE'), windowCloseHandler, 'Ctrl', 'W');
        fileMenu.append(this.fileCloseMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.closeMenuItem = this.addMenuItem(root.Locale.get('CLOSE'), root.close.bind(root), 'Ctrl', 'Q');
        fileMenu.append(this.closeMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('FILE'),
            submenu: fileMenu
        }));
    };

    MenuBuilder.prototype.setupEditMenu = function () {
        var fileMenu = new gui.Menu();

        // -------------------------------------------------------------------------------------------------------------

        this.editRestoreMenuItem = this.addMenuItem(root.Locale.get('EDIT_RESTORE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                activeWindow.setPrimaryState();
            }
        }, 'Ctrl', 'Z');
        fileMenu.append(this.editRestoreMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('EDIT'),
            submenu: fileMenu
        }));
    };

    MenuBuilder.prototype.setupBoxMenu = function () {
        var toolsMenu = new gui.Menu();

        // -------------------------------------------------------------------------------------------------------------

        this.toolsDuplicateMenuItem = this.addMenuItem(root.Locale.get('TOOLS_DUPLICATE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                var original = activeWindow.settings.picture;
                var copy = _.clone(activeWindow.settings.picture);

                copy.canvas = original.canvas.copy();

                new root.PictureWindow({
                    picture: copy
                });
            }
        }, 'Ctrl-Shift', 'D');
        toolsMenu.append(this.toolsDuplicateMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.addSeparator(toolsMenu);

        // -------------------------------------------------------------------------------------------------------------

        this.toolsLutMenuItem = this.addMenuItem(root.Locale.get('TOOLS_LUT'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                // Save current version.
                var current = activeWindow.settings.picture.canvas;

                // Restore to original version.
                var original = new root.Canvas(activeWindow.settings.picture.canvas.settings);
                original.loadGrayScaleImage(activeWindow.settings.picture.img, activeWindow.settings.picture.width, activeWindow.settings.picture.height);

                new root.LookUpTableWindow(activeWindow, {
                    picture: activeWindow.settings.picture,
                    canvas: {
                        current: current,
                        original: original
                    }
                });
            }
        }, 'Ctrl-Shift', 'T');
        toolsMenu.append(this.toolsLutMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.toolsUOPMenuItem = this.addMenuItem(root.Locale.get('TOOLS_UOP'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                var original = activeWindow.settings.picture;
                var copy = _.clone(activeWindow.settings.picture);

                copy.canvas = original.canvas.copy();

                new root.UOPWindow(activeWindow, {
                    picture: copy
                });
            }
        }, 'Ctrl-Shift', 'U');
        toolsMenu.append(this.toolsUOPMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('TOOLS'),
            submenu: toolsMenu
        }));
    };

    MenuBuilder.prototype.setupOperationsMenu = function () {
        var operationItem = new gui.MenuItem({
            label: root.Locale.get('OPERATIONS')
        });

        // Wygładzanie histogramu
        // ----------------------

        var flatteningHistogramOperationsMenu = new gui.Menu();

        this.operationsFlatteningHistogramMediumMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsFlatteningHistogram.flatteningHistogramMedium(activeWindow);
            });
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramMediumMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsFlatteningHistogramRandomMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsFlatteningHistogram.flatteningHistogramRandom(activeWindow);
            });
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramRandomMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsFlatteningHistogram.flatteningHistogramNeighbourhood(activeWindow);
            });
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramNeighboudhoodMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsFlatteningHistogramCustomMethodMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsFlatteningHistogram.flatteningHistogramCustom(activeWindow);
            });
        });
        flatteningHistogramOperationsMenu.append(this.operationsFlatteningHistogramCustomMethodMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        var histogramOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_FLATTENING_HISTOGRAM'));
        histogramOperationsMenuItem.submenu = flatteningHistogramOperationsMenu;

        // Jednopunktowe
        // -------------

        var onePointOperationsMenu = new gui.Menu();

        this.operationsOnePointNegativeMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_NEGATIVE'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsOnePoint.onePointNegative(activeWindow);
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointNegativeMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointThresholdMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_THRESHOLD'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ThresholdTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointThresholdMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointPosterizeMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_POSTERIZE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new PosterizeTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointPosterizeMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointStretchingMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_STRETCHING'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new StretchTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointStretchingMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointBrightnessRegulationMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new BrightnessRegulationTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointBrightnessRegulationMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointContrastRegulationMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_CONTRAST_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new ContrastRegulationTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointContrastRegulationMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointGammaRegulationMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_GAMMA_REGULATION'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new GammaRegulationTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });
        onePointOperationsMenu.append(this.operationsOnePointGammaRegulationMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsOnePointArithmeticalLogicalMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT_ARITHMETICAL_LOGICAL'), function () {
            return new ArithmeticalLogicalTool();
        });
        onePointOperationsMenu.append(this.operationsOnePointArithmeticalLogicalMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        var onePointOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_ONE_POINT'));
        onePointOperationsMenuItem.submenu = onePointOperationsMenu;

        // Sąsiedztwa
        // ----------

        var neighbourhoodOperationsMenu = new gui.Menu();

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSmoothingMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new SmoothingTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSmoothingMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSharpenMediumMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN_MEDIUM'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsNeighbourhood.sharpen(activeWindow, {
                    type: 'med'
                });
            });
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSharpenMediumMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSharpenMinimalMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN_MINIMAL'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsNeighbourhood.sharpen(activeWindow, {
                    type: 'min'
                });
            });
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSharpenMinimalMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        this.operationsNeighbourhoodSharpenMaximalMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN_MAXIMAL'), function () {
            new Operation(function () {
                var activeWindow = root.App.windowManager.getActiveWindow();
                root.OperationsNeighbourhood.sharpen(activeWindow, {
                    type: 'max'
                });
            });
        });
        neighbourhoodOperationsMenu.append(this.operationsNeighbourhoodSharpenMaximalMenuItem);

        // -------------------------------------------------------------------------------------------------------------

        var neighbourhoodOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_NEIGHBOURHOOD'));
        neighbourhoodOperationsMenuItem.submenu = neighbourhoodOperationsMenu;

        // Morfologiczne
        // -------------

        this.morphologicalOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_MORPHOLOGICAL'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            return new MorphologicalTool(activeWindow, {
                picture: activeWindow.settings.picture
            });
        });

        // Algorytm Żółwia
        // ---------------

        this.turtleOperationsMenuItem = this.addMenuItem(root.Locale.get('OPERATIONS_TURTLE'), function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (activeWindow instanceof root.PictureWindow) {
                new Operation(function () {
                    root.TurtleAlgorithm(activeWindow);
                });
            }
        }, 'Ctrl', 'L');

        // ----

        var operationsMenu = new gui.Menu();
        operationsMenu.append(histogramOperationsMenuItem);
        operationsMenu.append(onePointOperationsMenuItem);
        operationsMenu.append(neighbourhoodOperationsMenuItem);
        operationsMenu.append(this.morphologicalOperationsMenuItem);
        operationsMenu.append(this.turtleOperationsMenuItem);

        operationItem.submenu = operationsMenu;

        this.windowMenu.append(operationItem);
    };

    MenuBuilder.prototype.setupHelpMenu = function () {
        var helpMenu = new gui.Menu();

        this.aboutAuthorsMenuItem = this.addMenuItem(root.Locale.get('ABOUT_AUTHORS'), function () {
            var lines = [
                root.Locale.get('ABOUT_AUTHORS') + ':',
                '- Piotr Kowalski - piecioshka@gmail.com',
                '- Krzysztof Snopkiewicz - k.snopkiewicz@me.com'
            ];
            root.alert(lines.join('\n'));
        }, 'Ctrl-Shift', 'A');
        helpMenu.append(this.aboutAuthorsMenuItem);

        this.addSeparator(helpMenu);

        this.aboutHelpMenuItem = this.addMenuItem(root.Locale.get('ABOUT_HELP'), function () {
            var pdf = path.resolve('app', 'docs', 'help.pdf');
            gui.Shell.openItem(pdf);
        }, 'Ctrl-Shift', 'P');
        helpMenu.append(this.aboutHelpMenuItem);

        this.windowMenu.append(new gui.MenuItem({
            label: root.Locale.get('ABOUT'),
            submenu: helpMenu
        }));
    };

    // Extend `MenuBuilder` module with events.
    _.extend(MenuBuilder.prototype, root.EventEmitter);

    // Export `MenuBuilder`.
    return (root.MenuBuilder = MenuBuilder);

}(this));
