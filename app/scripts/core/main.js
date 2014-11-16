(function (root) {
    'use strict';

    // Set title of application.
    root.document.title = root.locale.get('NAME');

    var Bootstrap = {
        setup: function () {
            this.setupMainMenu();
            this.setupWindowManager();
        },

        setupMainMenu: function () {
            // Create main `Menu`.
            var menu = root.App.menu = new root.Menu();

            // File menu.
            // ----------

            menu.on(root.Menu.EVENTS.FILE_OPEN, function () {
                var file = new root.FileChooser({
                    place: '#app'
                });

                file.once(root.FileChooser.EVENTS.SELECT_FILE, function (params) {
                    // Listen for load image from user.
                    root.AssetsLoader.once(root.AssetsLoader.EVENTS.IMAGE_LOADED, function (image) {
                        new PictureWindow({
                            image: image
                        });
                    });

                    // Loading choose file.
                    root.AssetsLoader.loadImage(params.file, params.name);
                });
            });

            menu.on(root.Menu.EVENTS.FILE_CLOSE, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // We can close only activate window.
                if (activeWindow instanceof AbstractWindow) {
                    activeWindow.close();
                } else {
                    alert(root.locale.get('MSG_ERR_NO_OPEN_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.CLOSE, function () {
                // Close program.
                root.close();
            });

            menu.on(root.Menu.EVENTS.EDIT_RESTORE, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    // Restore picture.
                    activeWindow.buildImage();
                    // Restore title
                    activeWindow.updateTitle(activeWindow.getTitle().replace(/\* /, ''));
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            // Box menu.
            // ---------

            menu.on(root.Menu.EVENTS.BOX_HISTOGRAM, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    new HistogramWindow({
                        image: activeWindow.settings.image,
                        canvas: activeWindow.canvas
                    });
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.BOX_DUPLICATE, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    new PictureWindow({
                        image: activeWindow.settings.image
                    });
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.BOX_LUT, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    // TODO(piecioshka): LUT
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            // Operations menu.
            // ================

            // Flattening of histogram.
            // ------------------------

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationFlatteningHistogram.flatteningHistogramMedium();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationFlatteningHistogram.flatteningHistogramRandom();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationFlatteningHistogram.flatteningHistogramNeighbourhood();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationFlatteningHistogram.flatteningHistogramCustom();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            // One point.
            // ----------

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_NEGATIVE, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationOnePoint.onePointNegative();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_THRESHOLD, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationOnePoint.onePointThreshold();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_REDUCTION_GRAY_SCALE, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationOnePoint.onePointReductionGrayScale();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_STRETCHING, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationOnePoint.onePointStretching();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationOnePoint.onePointBrightnessRegulation();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_CONTRAST_REGULATION, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationOnePoint.onePointContrastRegulation();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_GAMMA_REGULATION, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    root.OperationOnePoint.onePointGammaRegulation();
                } else {
                    alert(root.locale.get('MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW'));
                }
            });

            // Neighbourhood.
            // --------------

            menu.on(root.Menu.EVENTS.OPERATIONS_NEIGHBOURHOOD_SMOOTHING, function () {
                
            });
        },

        setupWindowManager: function () {
            root.App.windowManager = new root.WindowManager();
        }
    };

    // Block modify context.
    _.bindAll(Bootstrap, 'setup');

    // Waiting for trigger `load` event by engine.
    root.addEventListener('load', Bootstrap.setup);

    // Handle each `keydown` event and check about shortcut.
    root.addEventListener('keydown', root.KeyboardShortcut.handler);

}(this));
