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

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD, function () {
                console.log('Operacje -> Wygładzanie histogram -> Metoda średnich');
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD, function () {
                console.log('Operacje -> Wygładzanie histogram -> Metoda losowa');
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD, function () {
                console.log('Operacje -> Wygładzanie histogram -> Metoda sąsiedztwa');
            });

            menu.on(root.Menu.EVENTS.OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD, function () {
                console.log('Operacje -> Wygładzanie histogram -> Metoda własna');
            });

            // Join modules: Menu & Canvas.
            menu.on(root.Menu.EVENTS.SAMPLE, function () {
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
