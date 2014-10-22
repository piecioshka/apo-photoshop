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
            // Create bar graph histogram.
            this.buildBarGraph();
            // Trigger event after building histogram.
            this.emit(HistogramWindow.EVENTS.RENDER_HISTOGRAM);
        });

        // Render window.
        this.render();
    };

    HistogramWindow.prototype.normalize = function (pixels) {
        var max = root.Utilities.max.apply(this, pixels);

        return pixels.map(function (item) {
            return item * this.settings.height / max;
        }, this);
    };

    HistogramWindow.prototype.buildBarGraph = function () {
        var hist = this.settings.canvas.getHistogram();
        var average = this.settings.canvas.getHistogramAverage();

        var max = root.Utilities.max.apply(this, hist);

        hist = this.normalize(hist);

        this.paintHistogram(hist);

        average = this.normalize([0, average, max])[1];

        this.paintHistogramAverage(average);
    };

    HistogramWindow.prototype.paintHistogram = function (normalizeHist) {
        this.canvas.ctx.fillStyle = 'rgb(0, 0, 0)';

        normalizeHist.forEach(function (size, index) {
            var w = 1;
            var h = size * this.settings.height / 100;
            var x = index * w;
            var y = this.settings.height - h;

            this.canvas.ctx.fillRect(x, y, w, h);
        }, this);
    };

    HistogramWindow.prototype.paintHistogramAverage = function (average) {
        this.canvas.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.canvas.ctx.fillRect(0, this.settings.height - average, this.settings.width, 1);
    };

    HistogramWindow.EVENTS = {
        RENDER_HISTOGRAM: 'render-histogram'
    };

    // Exports `HistogramWindow`.
    return (root.HistogramWindow = HistogramWindow);

}(this));
