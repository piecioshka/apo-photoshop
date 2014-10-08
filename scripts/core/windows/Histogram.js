(function (root) {
    'use strict';

    var Histogram = function (image) {
        this.width = 300;
        this.height = 200;
        this.image = image;
        this.canvas = null;

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
        this.canvas = new root.Canvas({
            width: this.width,
            height: this.height
        });

        // Set reference to window, where will be rendered.
        this.canvas.setWindow(win);

        // Create $canvas space.
        this.canvas.render();

        // Create something stupid.
        this.buildBarGraph();

        // Render window.
        win.render();
    };

    Histogram.prototype.buildBarGraph = function () {
        var items = [0, 2, 4, 2, 5, 6, 49, 20, 50, 3, 83, 2, 34, 15, 1, 44];
        items = items.concat(items);

        var BAR_WIDTH = parseInt(this.width / items.length, 10);
        this.canvas.ctx.fillStyle = 'rgb(100, 100, 100)';

        items.forEach(function (size, index) {
            var w = BAR_WIDTH;
            var h = size * this.height / 100;
            var x = index * BAR_WIDTH;
            var y = this.height - h;
            this.canvas.ctx.fillRect(x, y, w, h);
        }, this);
    };

    // Exports `Histogram`.
    return (root.Histogram = Histogram);

}(this));
