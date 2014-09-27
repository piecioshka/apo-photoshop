(function (root) {
    'use strict';

    function bootstrap() {
        // Create main `Menu`.
        var menu = new root.Menu();

        menu.on(root.Menu.EVENTS.FILE_OPEN, function () {
            var file = new FileChooser({
                place: '#app'
            });

            file.once(root.FileChooser.EVENTS.SELECT_FILE, function (params) {
                // listen for load image from user
                root.AssetsLoader.once(root.AssetsLoader.EVENTS.IMAGE_LOADED, function (image) {
                    // Create `Canvas` instance.
                    var canvas = new root.Canvas({
                        place: '#app',
                        width: image.width,
                        height: image.height
                    });

                    // Create $canvas space.
                    canvas.render();

                    // put image to canvas
                    canvas.buildImage(image);
                });

                // loading choose file
                root.AssetsLoader.loadImage(params.file);
            });
        });

        // Join modules: Menu & Canvas
        menu.on(root.Menu.EVENTS.SAMPLE, function () {
            // Create `Canvas` instance.
            var canvas = new root.Canvas({
                place: '#app',
                width: 400,
                height: 200
            });

            // Create $canvas space.
            canvas.render();

            // create something stupid
            canvas.buildSample();
        });
    }

    // Waiting for trigger `load` event by engine.
    window.addEventListener('load', bootstrap);

}(this));
