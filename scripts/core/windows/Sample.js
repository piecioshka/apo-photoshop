(function (root) {
    'use strict';

    var Sample = function () {
        this.initialize();
    };

    Sample.prototype.initialize = function () {
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
    };

    // Exports `Sample`.
    return (root.Sample = Sample);

}(this));
