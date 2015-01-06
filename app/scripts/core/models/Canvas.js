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
        this.$canvas.id = _.uniqueId('canvas-');

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
     * Remove <canvas> tag.
     */
    Canvas.prototype.remove = function () {
        this.$placeHolder.removeContent(this.$canvas);
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

        var i, color;

        for (i = 0; i < len / 4; i++) {
            color = pixelsChannelsData[(i * 4)];

            // Update each channel (RGB) of pixel. Not modify channel alpha.
            pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
        }

        // Update <canvas>
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
        // Remove duplicated colors. Sort result.
        return _.uniq(pixelsArray).sort(root.Utilities.sortNumbers);
    };

    /**
     * Returns list with counting pixel color from first channel.
     *
     * @returns {Array}
     */
    Canvas.prototype.getCountingColorList = function () {
        var levels = 256;

        // Create list of all gray levels.
        var hist = new Array(levels);

        // Set default to 0.
        while (levels--) hist[levels] = 0;

        // Copy to array all channels. References was destroyed.
        var pixelsArray = this.getOneChannelOfPixels();

        // Loop for each pixels.
        _.each(pixelsArray, function (color) {
            // Append histogram list.
            hist[color] = (hist[color] || 0) + 1;
        });

        return hist;
    };

    /**
     * Put full white rectangular on <canvas> which `reset it`.
     */
    Canvas.prototype.clear = function () {
        this.ctx.clearRect(0 , 0, this.settings.width, this.settings.height);
    };

    /**
     * Returns a copy of current instance of Canvas object.
     *
     * @returns {Window.Canvas}
     */
    Canvas.prototype.copy = function () {
        var canvas = new root.Canvas(this.settings);
        canvas.$canvas.classList.add('canvas-picture');
        canvas.loadGrayScaleImage(this.$canvas, this.settings.width, this.settings.height);
        return canvas;
    };

    /**
     * Convert <canvas> to image with *.png extension.
     *
     * @returns {Image}
     */
    Canvas.prototype.toImage = function () {
        var image = new Image();
        image.src = this.$canvas.toDataURL('image/png');
        return image;
    };

    /**
     * Convert <canvas> to buffer.
     *
     * @returns {Buffer}
     */
    Canvas.prototype.toBuffer = function () {
        return new Buffer(this.$canvas.toDataURL('image/png').split(',')[1], 'base64');
    };

    /**
     * Returns pixel RGBa by XY position.
     *
     * @param {number} x
     * @param {number} y
     * @returns {{r: *, g: *, b: *, a: *}}
     */
    Canvas.prototype.getPixel = function (x, y) {
        _.assert(_.isNumber(x));
        _.assert(_.isNumber(y));

        var pixelsChannels = this.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var width = this.settings.width;
        var height = this.settings.height;
        var i = root.CanvasHelper.convertXYToPositionIndex(width, height, x, y);
        var r = pixelsChannelsData[(i * 4)];
        var g = pixelsChannelsData[(i * 4) + 1];
        var b = pixelsChannelsData[(i * 4) + 2];
        var a = pixelsChannelsData[(i * 4) + 3];
        return { r: r, g: g, b: b, a: a };
    };

    /**
     * Update color.
     *
     * @param {number} x
     * @param {number} y
     * @param {Array} color
     */
    Canvas.prototype.setPixel = function (x, y, color) {
        _.assert(_.isNumber(x));
        _.assert(_.isNumber(y));
        _.assert(_.isArray(color));
        _.assert(_.contains([3, 4], _.size(color)));

        var pixelsChannels = this.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var width = this.settings.width;
        var height = this.settings.height;
        var i = root.CanvasHelper.convertXYToPositionIndex(width, height, x, y);

        pixelsChannelsData[(i * 4)] = color[0];
        pixelsChannelsData[(i * 4) + 1] = color[1];
        pixelsChannelsData[(i * 4) + 2] = color[2];

        if (color[3]) {
            pixelsChannelsData[(i * 4) + 3] = color[3];
        }

        this.ctx.putImageData(pixelsChannels, 0, 0);
    };

    /**
     * Loop through each pixel on image. Put `X` and `Y` as params.
     *
     * @param {Function} handler
     */
    Canvas.prototype.each = function (handler) {
        _.assert(_.isFunction(handler));

        var pixelsChannels = this.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;
        var width = this.settings.width;
        var height = this.settings.height;

        var i, dimensions;

        for (i = 0; i < len / 4; i++) {
            dimensions = root.CanvasHelper.convertPositionIndexToXY(width, height, i);
            handler(dimensions.x, dimensions.y);
        }
    };

    // Extend `Canvas` module with events.
    _.extend(Canvas.prototype, root.EventEmitter);

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));
