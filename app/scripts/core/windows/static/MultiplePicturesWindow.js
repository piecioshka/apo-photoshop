/*global promise */

(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var MultiplePicturesWindow = function (params) {
        // console.info('new MultiplePicturesWindow', params);

        this.settings = {
            pictures: []
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;

        // Flag tell that window is active.
        this.isActive = false;

        this.setup();
        this.initialize();
    };

    MultiplePicturesWindow.prototype = new root.AbstractWindow();

    MultiplePicturesWindow.prototype.initialize = function () {
        this.$window.classList.add('multiple-pictures-window');

        // Update title (add each file name).
        this.updateTitle('Wiele obrazów: ' + _.map(this.settings.pictures, function (frame) {
            return frame.name;
        }).join(', '));

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildStrip();
        });

        // Render window.
        this.render();
    };

    MultiplePicturesWindow.prototype.buildStrip = function () {
        var $strip = doc.createElement('div');
        $strip.classList.add('strip-axis');

        this.$content.appendChild($strip);
        this.$content = $strip;

        this.loadPictures();
    };

    MultiplePicturesWindow.prototype.loadPictures = function () {
        var self = this;
        var pictures = [];

        // Loop through each of file (images).
        _.each(this.settings.pictures, function (frame) {

            var asyncLoad = function () {
                var p = new promise.Promise();

                // Load selected file.
                root.AssetsLoader.loadImage(frame.file, frame.name, function (params) {
                    self.addPicture(params);
                    p.done();
                });

                return p;
            };

            pictures.push(asyncLoad);
        });

        promise.chain(pictures).then(function () {
            console.log('Pictures are ready', self.settings.pictures);
        });
    };

    MultiplePicturesWindow.prototype.addPicture = function (frame) {
        // Append width of pictures list (use margin bottom).
        this._resizeStrip(frame.image.height + MultiplePicturesWindow.MARGIN_BOTTOM);

        // Create `Canvas` instance.
        var canvas = new root.Canvas({
            width: frame.image.width,
            height: frame.image.height
        });

        // Create $canvas space.
        canvas.render(this);

        // Put loaded image to canvas form.
        canvas.loadGrayScaleImage(frame.image, frame.width, frame.height);
    };

    MultiplePicturesWindow.prototype._resizeStrip = function (size) {
        this.$content.style.height = (parseInt(this.$content.style.height, 10) || 0) + (size) + 'px';
    };

    MultiplePicturesWindow.MARGIN_BOTTOM = 3;

    // Exports `MultiplePicturesWindow`.
    return (root.MultiplePicturesWindow = MultiplePicturesWindow);

}(this));
