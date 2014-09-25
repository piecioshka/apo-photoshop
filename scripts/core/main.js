(function (root) {
    'use strict';

    function bootstrap() {
        // Create main `Menu`.
        var menu = new root.Menu();

        // Create `Canvas` instance.
        var canvas = new root.Canvas({
            place: '#app',
            width: 400,
            height: 200
        });

        // Create canvas space.
        canvas.render();

        // Join modules: Menu & Canvas
        menu.on('sample', function () {
            canvas.buildSample();
        });
    }

    // Waiting for trigger `load` event by engine.
    window.addEventListener('load', bootstrap);

}(this));
