(function (root) {
    'use strict';

    var assert = require('assert');
    var extend = require('extend');

    // Aliases.
    var doc = root.document;

    var HistogramWindow = function (params) {
        console.log('new HistogramWindow', params);

        this.settings = extend({
            renderAreaID: '#app',
            image: null,
            canvas: null,
            width: 300,
            height: 200
        }, params);

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
        // Update title of window.
        this.updateTitle('Histogram');

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
        var items = [];
        var channel = 0;

        this.canvas.onEachPixel(function (x, y) {
            var imageData = this.settings.canvas.ctx.getImageData(x, y, 1, 1);

            if (!items[imageData.data[channel]]) {
                items[imageData.data[channel]] = 0;
            }

            items[imageData.data[channel]]++;
        }, this);

        console.warn(items);

        var BAR_WIDTH = parseInt(this.settings.width / items.length, 10);
        this.canvas.ctx.fillStyle = 'rgb(100, 100, 100)';

        items.forEach(function (size, index) {
            var w = BAR_WIDTH;
            var h = size * this.settings.height / 100;
            var x = index * BAR_WIDTH;
            var y = this.settings.height - h;
            this.canvas.ctx.fillRect(x, y, w, h);
        }, this);
    };

    // Exports `HistogramWindow`.
    return (root.HistogramWindow = HistogramWindow);

}(this));
