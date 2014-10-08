(function (root) {
    'use strict';

    var locale = require('cjson').load('./locale/pl_PL.json');

    // Set title of application.
    root.document.title = locale.NAME;

    var Bootstrap = {
        setup: function () {
            this.setupMainMenu();
            this.setupWindowManager();
        },

        setupMainMenu: function () {
            // Create main `Menu`.
            root.App.menu = new root.Menu();

            root.App.menu.on(root.Menu.EVENTS.FILE_OPEN, function () {
                var file = new FileChooser({
                    place: '#app'
                });

                file.once(root.FileChooser.EVENTS.SELECT_FILE, function (params) {
                    // Listen for load image from user.
                    root.AssetsLoader.once(root.AssetsLoader.EVENTS.IMAGE_LOADED, function (image) {
                        return new Picture(image);
                    });

                    // Loading choose file.
                    root.AssetsLoader.loadImage(params.file, params.name);
                });
            });

            root.App.menu.on(root.Menu.EVENTS.BOX_HISTOGRAM, function () {
                return new Histogram();
            });

            // Join modules: Menu & Canvas.
            root.App.menu.on(root.Menu.EVENTS.SAMPLE, function () {
                return new Sample();
            });
        },

        setupWindowManager: function () {
            root.App.windowManager = new root.InternalWindowManager();
        }
    };

    // Block modify context.
    _.bindAll(Bootstrap, 'setup');

    // Waiting for trigger `load` event by engine.
    root.addEventListener('load', Bootstrap.setup);

    // Handle each `keydown` event and check about shortcut.
    root.addEventListener('keydown', root.KeyboardShortcut.handler);

}(this));
