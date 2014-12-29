(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var MultiplePicturesWindow = function (params) {
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
        this.isActive = false;

        this.setup();
        this.initialize();
    };

    MultiplePicturesWindow.prototype = new root.AbstractWindow();

    MultiplePicturesWindow.prototype.initialize = function () {
        this.$window.classList.add('multiple-pictures-window');

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildStrip();

            // Update title (add each file name).
            this.updateTitle(_.map(this.settings.pictures, function (frame) {
                return frame.name;
            }).join(', '));
        });

        // Render window.
        this.render();
    };

    MultiplePicturesWindow.prototype.buildStrip = function () {
        var $strip = doc.createElement('div');
        $strip.classList.add('strip-axis');

        this.$content.appendChild($strip);
        this.$content = $strip;

        _.each(this.settings.pictures, function (picture, index) {
            this.addPicture(picture, index);
        }, this);
    };

    MultiplePicturesWindow.prototype.addPicture = function (picture, index) {
        // Append width of pictures list (use margin bottom).
        this._resizeStrip(picture.img.height + MultiplePicturesWindow.MARGIN_BOTTOM);

        // Create `Canvas` instance.
        var canvas = new root.Canvas({
            width: picture.img.width,
            height: picture.img.height
        });

        // Create $canvas space.
        canvas.render(this);

        // Put loaded image to canvas form.
        canvas.loadGrayScaleImage(picture.img, picture.width, picture.height);

        this.settings.pictures[index].canvas = canvas;
    };

    MultiplePicturesWindow.prototype._resizeStrip = function (size) {
        this.$content.style.height = (parseInt(this.$content.style.height, 10) || 0) + (size) + 'px';
    };

    MultiplePicturesWindow.prototype.addClickEvent = function () {
        var self = this;

        function clearSelection() {
            var canvases = _.toArray(self.$content.querySelectorAll('canvas'));
            _.each(canvases, function (canvas) {
                canvas.classList.remove('active');
            });
        }

        function addSelection(element) {
            element.classList.add('active');
        }

        function isCanvas(element) {
            return element.nodeName.toLowerCase() === 'canvas';
        }

        this.$content.addEventListener('click', function (evt) {
            var $element = evt.target;

            if (isCanvas($element)) {
                clearSelection();
                addSelection($element);

                self.emit(MultiplePicturesWindow.EVENTS.SELECT_PICTURE, { picture: $element });
            }
        });
    };

    MultiplePicturesWindow.prototype.getPictures = function () {
        return this.settings.pictures;
    };

    MultiplePicturesWindow.MARGIN_BOTTOM = 3;

    MultiplePicturesWindow.EVENTS = {
        SELECT_PICTURE: 'picture:select'
    };

    // Exports `MultiplePicturesWindow`.
    return (root.MultiplePicturesWindow = MultiplePicturesWindow);

}(this));
