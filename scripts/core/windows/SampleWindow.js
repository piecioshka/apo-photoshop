(function (root) {
    'use strict';

    var SampleWindow = function () {
        this.canvas = null;

        this.initialize();
    };

    SampleWindow.prototype.initialize = function () {
        // Create window container.
        var win = new AbstractWindow({
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

    SampleWindow.prototype.buildSample = function () {
        this.canvas.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.canvas.ctx.fillRect(0, 0, 200, 100);
    };

    // Exports `SampleWindow`.
    return (root.SampleWindow = SampleWindow);

}(this));
