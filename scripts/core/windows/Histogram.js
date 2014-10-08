(function (root) {
    'use strict';

    var Histogram = function (image) {
        this.image = image;
        this.initialize();
    };

    Histogram.prototype.initialize = function () {
        // Create window container.
        var win = new InternalWindow({
            renderAreaID: '#app'
        });

        // Update title of window.
        win.updateTitle('Histogram');

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
        canvas.buildBarGraph([0, 2, 4, 2, 5, 6, 49, 20, 50, 3]);

        // Render window.
        win.render();
    };

    // Exports `Histogram`.
    return (root.Histogram = Histogram);

}(this));
