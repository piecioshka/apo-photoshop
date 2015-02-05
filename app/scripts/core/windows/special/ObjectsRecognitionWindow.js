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

        this.originalColors = [];
        this.newColors = [];

        this.setup();
        this.initialize();
    };

    ObjectsRecognitionWindow.prototype = new root.AbstractWindow();

    ObjectsRecognitionWindow.prototype.initialize = function () {
        this.$window.classList.add('objects-recognition-window');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI(function () {
                // Set static width.
                this.setRigidWidth();

                // Update title (add each file name).
                this.updateTitle(root.Locale.get('TOOLS_OBJECTS_RECOGNITION') + ' - ' + this.settings.picture.name);

                // Append window list.
                root.App.windowManager.addWindow(this);

                this.emit(root.AbstractWindow.EVENTS.READY);
            });
        });

        // Render window.
        this.render();
    };

    ObjectsRecognitionWindow.prototype.buildUI = function (cb) {
        var self = this;

        new root.Operation(function () {
            this.originalColors = this._useValleyMethod(this.settings.picture);

            if (_.isEmpty(this.originalColors)) {
                root.alert(root.Locale.get('MSG_ERR_UNRECOGNIZED_OBJECTS'));

                // Close window.
                root.App.windowManager.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: self });
            } else {
                this._buildStrip();

                if (_.isFunction(cb)) {
                    cb.call(self);
                }
            }
        }, this);
    };

    ObjectsRecognitionWindow.prototype._buildStrip = function () {
        var $strip = doc.createElement('div');
        $strip.classList.add('strip-axis');

        this.$content.appendChild($strip);
        this.$content = $strip;

        _.each(this.originalColors, function (objectColor) {
            this._addPicture(objectColor);
            this._addColorChooser();
        }, this);

        this._addSubmitButton();
    };

    ObjectsRecognitionWindow.prototype._addPicture = function (objectColor) {
        var pic = this.settings.picture;

        var canvas = new root.Canvas({
            width: pic.width,
            height: pic.height
        });

        this._fillColor(canvas, objectColor);

        canvas.render(this);
    };

    ObjectsRecognitionWindow.prototype._addColorChooser = function () {
        var pic = this.settings.picture;

        var $right = doc.createElement('div');
        $right.style.height = pic.height + 'px';
        $right.classList.add('selected-color');

        var $label = doc.createElement('label');
        $label.innerText = 'Wybierz kolor:';
        $right.appendChild($label);

        var $input = doc.createElement('input');
        $input.setAttribute('type', 'color');
        $right.appendChild($input);

        this.$content.appendChild($right);
    };

    ObjectsRecognitionWindow.prototype._addSubmitButton = function () {
        var self = this;
        var $fieldset = doc.createElement('fieldset');

        var $submit = doc.createElement('button');
        $submit.textContent = root.Locale.get('MSG_APPLY');
        $fieldset.appendChild($submit);

        $submit.addEventListener('click', function () {
            self._applyColors();
        });

        var $cancel = doc.createElement('button');
        $cancel.textContent = root.Locale.get('MSG_CANCEL');
        $fieldset.appendChild($cancel);

        $cancel.addEventListener('click', function () {
            root.App.windowManager.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: self });
        });

        this.$content.appendChild($fieldset);
    };

    ObjectsRecognitionWindow.prototype._fillColor = function (canvas, objectColor) {
        var newColor;
        var whiteColor = 255;
        var pic = this.settings.picture;

        var originalCanvas = pic.canvas;
        var originalCanvasPixelsChannels = originalCanvas.getDataImage();
        var originalCanvasPixelsChannelsData = originalCanvasPixelsChannels.data;

        var pixelsChannels = canvas.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        var i, color;

        for (i = 0; i < len / 4; i++) {
            color = originalCanvasPixelsChannelsData[(i * 4)];

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
    };

    ObjectsRecognitionWindow.prototype._applyColors = function () {
        _.each(this.$content.querySelectorAll('input[type="color"]'), function ($input) {
            var hex = $input.value.substr(1);
            var selectedColor = root.Utilities.hex2rgb(hex);
            this.newColors.push(selectedColor);
        }, this);

        if (this.contextWindow instanceof root.MultiplePicturesWindow) {
            var multiply = new root.MultiplePicturesWindow({
                pictures: this.contextWindow.getCopyOfPictures()
            });

            multiply.on(root.AbstractWindow.EVENTS.READY, function () {
                var $pictures = multiply.getPictures();

                _.each($pictures, function ($picture) {
                    $picture.canvas = this._replaceColor($picture.canvas, this.originalColors, this.newColors);
                }, this);
            }, this);
        } else if (this.contextWindow instanceof root.PictureWindow) {
            var single = new root.PictureWindow({
                picture: this.contextWindow.getCopyOfPicture()
            });

            single.on(root.AbstractWindow.EVENTS.READY, function () {
                var $picture = single.getPicture();

                $picture.canvas = this._replaceColor($picture.canvas, this.originalColors, this.newColors);

                // Inform picture window that is modified.
                single.setModifiedState();
            }, this);
        }

        // Close current window.
        root.App.windowManager.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: this });
    };

    ObjectsRecognitionWindow.prototype._replaceColor = function (canvas, oldColors, newColors) {
        var whiteColor = 255;
        var pixelsChannels = canvas.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        for (var i = 0; i < len / 4; i++) {
            var color = pixelsChannelsData[(i * 4)];
            var index = oldColors.indexOf(color);

            if (index !== -1) {
                color = newColors[index];

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = color[0];
                pixelsChannelsData[(i * 4) + 1] = color[1];
                pixelsChannelsData[(i * 4) + 2] = color[2];
            } else {
                pixelsChannelsData[(i * 4)] = whiteColor;
                pixelsChannelsData[(i * 4) + 1] = whiteColor;
                pixelsChannelsData[(i * 4) + 2] = whiteColor;
            }
        }

        // Update <canvas>
        canvas.ctx.putImageData(pixelsChannels, 0, 0);

        return canvas;
    };

    // POB - Wykład 6, p. 15 - valley method
    ObjectsRecognitionWindow.prototype._useValleyMethod = function (pic) {
        var objectColors = [];
        var objectColorsCounting = [];
        var pixels = pic.canvas.getCountingColorList();
        var histHeight = 150;

        // Normalize
        var max = root.Utilities.max.apply(this, pixels);
        var normalizePixels = _.map(pixels, function (item) {
            return parseInt(item / max * histHeight, 10);
        });

        // When we have a lot of colors, get as working only most popular.
        // var workingPixels = normalizePixels;

        // When we have picture only with couple of colors use all them.
        var workingPixels = pixels;

        _.each(workingPixels, function (pixel, index) {
            // If color is not empty (zero)
            if (workingPixels[index]) {
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
