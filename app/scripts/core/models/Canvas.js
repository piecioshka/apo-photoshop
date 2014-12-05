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
     * Append <canvas> HTML element to place holder defined in settings.
     */
    Canvas.prototype.render = function (win) {
        (this.$placeHolder = win).appendContent(this.$canvas);
    };

    /**
     * Load image and convert to gray scale.
     *
     * @param {Image} image Original image from user drive
     * @param {number} width
     * @param {number} height
     */
    Canvas.prototype.loadGrayScaleImage = function (image, width, height) {
        // Load original image.
        this.ctx.drawImage(image, 0, 0, width, height);
        // Convert to gray scale image.
        this._convertToGrayScale();
    };

    /**
     * Use RED channel and copy to rest channels (GREEN, BLUE).
     * Not modify alpha channel.
     *
     * @access private
     */
    Canvas.prototype._convertToGrayScale = function () {
        var pixelsChannels = this.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        for (var i = 0; i < len / 4; i++) {
            var color = pixelsChannelsData[(i * 4)];

            // Update each channel (RGB) of pixel. Not modify channel alpha.
            pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
        }

        this.ctx.putImageData(pixelsChannels, 0, 0);
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
    Canvas.prototype.getAllChannelsOfPixels = function () {
        return this.getDataImage().data;
    };

    /**
     * Returns value of first channel (RED) from each pixel.
     * For gray scale images each of channel has the same values.
     *
     * @returns {Array}
     */
    Canvas.prototype.getOneChannelOfPixels = function () {
        var pixelsLongArray = this.getAllChannelsOfPixels();
        var pixelsArray = [];

        for (var i = 0; i < pixelsLongArray.length; i += 4) {
            pixelsArray[i / 4] = pixelsLongArray[i];
        }

        return pixelsArray;
    };

    /**
     * Returns array with unique pixel (only one) channel.
     *
     * @returns {Array}
     */
    Canvas.prototype.getUniqueChannels = function () {
        // Copy to array all channels. References was destroyed.
        var pixelsArray = this.getOneChannelOfPixels();
        return _.uniq(pixelsArray).sort(function (a, b) {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        });
    };

    /**
     * Returns list with counting pixel color from first channel.
     *
     * @returns {Array}
     */
    Canvas.prototype.getHistogram = function () {
        // Create list of all gray levels.
        var hist = new Array(256);

        // Set default to 0.
        hist = hist.map(function () { return 0; });

        // Copy to array all channels. References was destroyed.
        var pixelsArray = this.getOneChannelOfPixels();

        // Loop for each pixels.
        pixelsArray.forEach(function (color) {
            // Append histogram list.
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
        return root.Utilities.average.apply(this, this.getHistogram());
    };

    // Extend `Canvas` module with events.
    _.extend(Canvas.prototype, root.EventEmitter);

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));