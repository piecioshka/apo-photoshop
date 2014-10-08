(function (root) {
    'use strict';

    var cjson = require('cjson');
    var locale = cjson.load('./locale/pl_PL.json');

    // Set title of application.
    root.document.title = locale.NAME;

    function buildImageWindow(image) {
        // Create window container.
        var win = new InternalWindow({
            renderAreaID: '#app'
        });

        // Update title of window.
        win.updateTitle(image.name);

        // Append window list.
        root.App.windowManager.addWindow(win);

        // Create `Canvas` instance.
        var canvas = new root.Canvas({
            width: image.width,
            height: image.height
        });

        // Set reference to window, where will be rendered.
        canvas.setWindow(win);

        // Create $canvas space.
        canvas.render();

        // Put image to canvas.
        canvas.buildImage(image);

        // Render window.
        win.render();
    }

    function buildSampleWindow() {
        // Create window container.
        var win = new InternalWindow({
            renderAreaID: '#app'
        });

        // Update title of window.
        win.updateTitle('Sample');

        // Append window list.
        root.App.windowManager.addWindow(win);

        // Create `Canvas` instance.
        var canvas = new root.Canvas({
            width: 200,
            height: 100
        });

        // Set reference to window, where will be rendered.
        canvas.setWindow(win);

        // Create $canvas space.
        canvas.render();

        // Create something stupid.
        canvas.buildSample();

        // Render window.
        win.render();
    }

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
                    root.AssetsLoader.once(root.AssetsLoader.EVENTS.IMAGE_LOADED, buildImageWindow);

                    // Loading choose file.
                    root.AssetsLoader.loadImage(params.file, params.name);
                });
            });

            root.App.menu.on(root.Menu.EVENTS.BOX_HISTOGRAM, function () {
                console.log('show hist');
            });

            // Join modules: Menu & Canvas.
            root.App.menu.on(root.Menu.EVENTS.SAMPLE, buildSampleWindow);
        },

        setupWindowManager: function () {
            root.App.windowManager = new root.InternalWindowManager();
        }
    };

    // Block modify context.
    _.bindAll(Bootstrap, 'setup', 'setupMainMenu');

    // Waiting for trigger `load` event by engine.
    root.addEventListener('load', Bootstrap.setup);

    // Handle each `keydown` event and check about shortcut.
    root.addEventListener('keydown', root.KeyboardShortcut.handler);

}(this));
