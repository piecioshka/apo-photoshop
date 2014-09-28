(function (root) {
    'use strict';

    var cjson = require('cjson');
    var locale = cjson.load('./locale/pl_PL.json');

    // Set title of application.
    root.document.title = locale.NAME;

    var Bootstrap = {
        setup: function () {
            this.buildMenu();
        },

        buildMenu: function () {
            var self = this;

            // Create main `Menu`.
            var menu = new root.Menu();

            menu.on(root.Menu.EVENTS.FILE_OPEN, function () {
                var file = new FileChooser({
                    place: '#app'
                });

                file.once(root.FileChooser.EVENTS.SELECT_FILE, function (params) {
                    // Listen for load image from user.
                    root.AssetsLoader.once(root.AssetsLoader.EVENTS.IMAGE_LOADED, self._buildImage);

                    // Loading choose file.
                    root.AssetsLoader.loadImage(params.file);
                });
            });

            // Join modules: Menu & Canvas.
            menu.on(root.Menu.EVENTS.SAMPLE, this._buildSample);
        },

        _buildImage: function (image) {
            // Create window container.
            var win = new InternalWindow({
                renderAreaID: '#app'
            });

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
        },

        _buildSample: function () {
            // Create window container.
            var win = new InternalWindow({
                renderAreaID: '#app'
            });

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
    };

    // Block modify context.
    _.bindAll(Bootstrap, 'setup', 'buildMenu');

    // Waiting for trigger `load` event by engine.
    root.addEventListener('load', Bootstrap.setup);

    // Handle each `keydown` event and check about shortcut.
    root.addEventListener('keydown', root.KeyboardShortcut.handler);

}(this));
