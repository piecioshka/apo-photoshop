(function (root) {
    'use strict';

    var Sample = function () {
        this.canvas = null;

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
        this.canvas = new root.Canvas({
            width: 200,
            height: 100
        });

        // Set reference to window, where will be rendered.
        this.canvas.setWindow(win);

        // Create $canvas space.
        this.canvas.render();

        // Create something stupid.
        this.buildSample();

        // Render window.
        win.render();
    };

    Sample.prototype.buildSample = function () {
        this.canvas.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.canvas.ctx.fillRect(0, 0, 200, 100);
    };

    // Exports `Sample`.
    return (root.Sample = Sample);

}(this));
