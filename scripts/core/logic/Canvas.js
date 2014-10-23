(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var Canvas = function (params) {
        this.settings = {
            width: 100,
            height: 50
        };
        _.extend(this.settings, params);

        this.$placeHolder = null;
        this.$canvas = null;
        this.ctx = null;

        this.initialize();
    };

    Canvas.prototype.initialize = function () {
        // Create <canvas> object.
        this.$canvas = doc.createElement('canvas');

        // Set dimensions.
        this.setWidth();
        this.setHeight();

        // Set reference to Canvas context.
        this.ctx = this.$canvas.getContext('2d');
    };

    /**
     * Define place holder as window where <canvas> object will be rendered.
     *
     * @param {AbstractWindow} win
     */
    Canvas.prototype.setWindow = function (win) {
        this.$placeHolder = win;
    };

    /**
     * Set height of <canvas> tag.
     *
     * @param {number} [height] Default get size from `this.settings`.
     */
    Canvas.prototype.setHeight = function (height) {
        if (_.isNumber(height)) {
            this.settings.height = height;
        }

        this.$canvas.setAttribute('height', this.settings.height + 'px');
    };

    /**
     * Set width of <canvas> tag.
     *
     * @param {number} [width] Default get size from `this.settings`.
     */
    Canvas.prototype.setWidth = function (width) {
        if (_.isNumber(width)) {
            this.settings.width = width;
        }

        this.$canvas.setAttribute('width', this.settings.width + 'px');
    };

    /**
     * Append <canvas> object to place holder defined in settings.
     */
    Canvas.prototype.render = function () {
        this.$placeHolder.setContent(this.$canvas);
    };

    /**
     * Returns ImageData from <canvas> object.
     *
     * @returns {ImageData}
     */
    Canvas.prototype.getDataImage = function () {
        return this.ctx.getImageData(0, 0, this.settings.width, this.settings.height);
    };

    /**
     * Returns pixels array from canvas (context) object.
     *
     * @returns {CanvasPixelArray}
     */
    Canvas.prototype.getPixelsChannels = function () {
        return this.getDataImage().data;
    };

    /**
     * Returns value of first channel (RED) from each pixel.
     * For gray scale images each of channel has the same values.
     *
     * @returns {Array}
     */
    Canvas.prototype.getRedChannelPixels = function () {
        var pixels = this.getPixelsChannels();
        var red = [];

        for (var i = 0; i < pixels.length; i += 4) {
            red[i / 4] = pixels[i];
        }

        return red;
    };

    /**
     * Returns dict with channels RED, GREEN, BLUE, ALPHA.
     *
     * @returns {Array}
     */
    Canvas.prototype.getColorScalePixels = function () {
        var red = [], green = [], blue = [], alpha = [];
        var pixels = this.getPixelsChannels();

        for (var i = 0; i < pixels.length; i += 4) {
            red[i / 4]      = pixels[i];
            green[i / 4]    = pixels[i + 1];
            blue[i / 4]     = pixels[i + 2];
            alpha[i / 4]    = pixels[i + 3];
        }

        return [red, green, blue, alpha];
    };

    /**
     * Returns list with counting pixel color from first channel.
     *
     * @returns {Array}
     */
    Canvas.prototype.getHistogram = function () {
        var hist = [];
        var pixels = this.getRedChannelPixels();

        pixels.forEach(function (color) {
            hist[color] = (hist[color] || 0) + 1;
        });

        return hist;
    };

    /**
     * Return average value from histogram.
     *
     * @returns {number}
     */
    Canvas.prototype.getHistogramAverage = function () {
        var list = this.getHistogram();
        return Utilities.average.apply(this, list);
    };

    // Extend `Canvas` module with events.
    _.extend(Canvas.prototype, root.EventEmitter);

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));
