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
                var file = new FileChooser({
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
                }
            });

            menu.on(root.Menu.EVENTS.EDIT_RESTORE, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // We can close only activate window.
                if (activeWindow instanceof AbstractWindow) {
                    // Restore picture.
                    activeWindow.buildImage();
                }
            });

            // Box menu.
            // ---------

            menu.on(root.Menu.EVENTS.BOX_HISTOGRAM, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // We can create histogram only for picture.
                if (activeWindow instanceof PictureWindow) {
                    new HistogramWindow({
                        image: activeWindow.settings.image,
                        canvas: activeWindow.canvas
                    });
                }
            });

            menu.on(root.Menu.EVENTS.BOX_DUPLICATE, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support duplicate picture window.
                if (activeWindow instanceof PictureWindow) {
                    new PictureWindow({
                        image: activeWindow.settings.image
                    });
                }
            });

            menu.on(root.Menu.EVENTS.BOX_LUT, function () {
                var activeWindow = root.App.windowManager.getActiveWindow();

                // Support LUT only for picture window.
                if (activeWindow instanceof PictureWindow) {
                    // TODO(piecioshka): LUT
                }
            });

            // Operations menu.
            // ================

            // Flattening of histogram.
            // ------------------------

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD, function () {
                var o = new root.Operation();
                o.flatteningHistogramMedium();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD, function () {
                var o = new root.Operation();
                o.flatteningHistogramRandom();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD, function () {
                var o = new root.Operation();
                o.flatteningHistogramNeighbourhood();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD, function () {
                var o = new root.Operation();
                o.flatteningHistogramCustom();
            });

            // Colors.
            // -------

            menu.on(root.Menu.EVENTS.OPERATIONS_COLORS_GREEN, function () {
                var o = new root.Operation();
                o.useOnlyGreenColor();
            });

            // One point.
            // ----------

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_NEGATIVE, function () {
                var o = new root.Operation();
                o.onePointNegative();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_THRESHOLDING, function () {
                var o = new root.Operation();
                o.onePointThresholding();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_INVERSE_THRESHOLDING, function () {
                var o = new root.Operation();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_THRESHOLDING_RANGES, function () {
                var o = new root.Operation();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_THRESHOLDING_WITH_GRAY_SCALES, function () {
                var o = new root.Operation();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_STRETCHING, function () {
                var o = new root.Operation();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_REDUCTION_GRAY_SCALE, function () {
                var o = new root.Operation();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION, function () {
                var o = new root.Operation();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_CONTRAST_REGULATION, function () {
                var o = new root.Operation();
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_ONE_POINT_GAMMA_REGULATION, function () {
                var o = new root.Operation();
            });

            // Neighbourhood.
            // --------------

            menu.on(root.Menu.EVENTS.OPERATIONS_NEIGHBOURHOOD_SMOOTHING, function () {
                var o = new root.Operation();
            });

            // About menu.
            // -----------

            menu.on(root.Menu.EVENTS.ABOUT_SAMPLE, function () {
                new SampleWindow();
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
