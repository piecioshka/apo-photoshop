(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ObjectsRecognitionWindow = function ObjectsRecognitionWindow(contextWindow, params) {
        this.contextWindow = contextWindow;
        this.settings = {
            picture: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;
        this.isActive = false;

        this.setup(contextWindow);
        this.initialize();
    };

    ObjectsRecognitionWindow.prototype = new root.AbstractWindow();

    ObjectsRecognitionWindow.prototype.initialize = function () {
        this.$window.classList.add('images-recognition-window');

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI();

            // Update title (add each file name).
            this.updateTitle(root.Locale.get('TOOLS_OBJECTS_RECOGNITION') + ' - ' + this.settings.picture.name);
        });

        // Render window.
        this.render();
    };

    ObjectsRecognitionWindow.prototype.buildUI = function () {
        new Operation(function () {
            var objectColors = this._useValleyMethod(this.settings.picture);
            this._buildStrip(objectColors);
        }, this);
    };

    ObjectsRecognitionWindow.prototype._buildStrip = function (objectColors) {
        var $strip = doc.createElement('div');
        $strip.classList.add('strip-axis');

        this.$content.appendChild($strip);
        this.$content = $strip;

        _.each(objectColors, function (objectColor) {
            this._addPicture(objectColor);
        }, this);
    };

    ObjectsRecognitionWindow.prototype._addPicture = function (objectColor) {
        var self = this;
        var pic = this.settings.picture;

        var width = pic.width;
        var height = pic.height;
        var whiteColor = 255;

        var originalCanvas = pic.canvas;
        var originalCanvasPixelsChannels = originalCanvas.getDataImage();
        var originalCanvasPixelsChannelsData = originalCanvasPixelsChannels.data;

        var newColor;
        var canvas = new root.Canvas({
            width: width,
            height: height
        });

        var pixelsChannels = canvas.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        for (var i = 0; i < len / 4; i++) {
            var color = originalCanvasPixelsChannelsData[(i * 4)];

            if (objectColor !== color) {
                newColor = whiteColor;
            } else {
                newColor = color;
            }

            // Update each channel (RGB) of pixel.
            pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = newColor;

            // Alpha channel sets to opaque.
            pixelsChannelsData[(i * 4) + 3] = 255;
        }

        // Update <canvas>
        canvas.ctx.putImageData(pixelsChannels, 0, 0);

        canvas.render(self);
    };

    // POB - Wykład 6, p. 15 - valley method
    ObjectsRecognitionWindow.prototype._useValleyMethod = function (pic) {
        var objectColors = [];
        var objectColorsCounting = [];
        var pixels = pic.canvas.getCountingColorList();
        var histHeight = 150;

        // Normalize
        var max = root.Utilities.max.apply(this, pixels);

        var normalizePixels = pixels.map(function (item) {
            return parseInt(item / max * histHeight, 10);
        });

        _.each(normalizePixels, function (pixel, index) {
            // If color is not empty (zero)
            if (normalizePixels[index]) {
                // Push it to object colors counting list.
                objectColorsCounting.push(pixels[index]);
            }
        });

        // Get background color.
        var bg = root.Utilities.max.apply(this, objectColorsCounting);

        // Remove background (most of colors).
        objectColorsCounting = _.without(objectColorsCounting, bg);

        // Append list of colors.
        _.each(pixels, function (counting, color) {
            if (_.contains(objectColorsCounting, counting)) {
                objectColors.push(color);
            }
        });

        return objectColors;
    };

    // Exports `ObjectsRecognitionWindow`.
    return (root.ObjectsRecognitionWindow = ObjectsRecognitionWindow);

}(this));
