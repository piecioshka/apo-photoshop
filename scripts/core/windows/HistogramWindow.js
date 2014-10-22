(function (root) {
    'use strict';

    var assert = require('assert');

    // Aliases.
    var doc = root.document;

    var HistogramWindow = function (params) {
        console.warn('new HistogramWindow', params);

        this.settings = {
            renderAreaID: '#app',
            image: null,
            canvas: null,
            width: 256,
            height: 144
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(this.settings.renderAreaID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;

        // Flag tell that window is active.
        this.isActive = false;

        this.canvas = null;

        this.setup();
        this.initialize();
    };

    HistogramWindow.prototype = new AbstractWindow();
    HistogramWindow.prototype.constructor = HistogramWindow;

    HistogramWindow.prototype.initialize = function () {
        this.$window.classList.add('histogram-window');

        // Update title of window.
        this.updateTitle('Histogram - ' + this.settings.image.name);

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Create `Canvas` instance.
        this.canvas = new root.Canvas({
            width: this.settings.width,
            height: this.settings.height
        });

        // Set reference to window, where will be rendered.
        this.canvas.setWindow(this);

        // Create $canvas space.
        this.canvas.render();

        // Listen on window render.
        this.on(AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Create something stupid.
            this.buildBarGraph();
        });

        // Render window.
        this.render();
    };

    HistogramWindow.prototype.buildBarGraph = function () {
        this.paintHistogram(this.settings.canvas.getHistogram());
    };

    HistogramWindow.prototype.drawPipe = function () {
        this.canvas.ctx.fillRect.apply(this.canvas.ctx, arguments);
    };

    HistogramWindow.prototype.paintHistogram = function (items) {
        this.canvas.ctx.fillStyle = 'rgb(0, 0, 0)';

        items.forEach(function (size, index) {
            var w = 1;
            var h = size * this.settings.height / 100;
            var x = index * w;
            var y = this.settings.height - h;

            this.drawPipe(x, y, w, h);
        }, this);
    };

    // Exports `HistogramWindow`.
    return (root.HistogramWindow = HistogramWindow);

}(this));
