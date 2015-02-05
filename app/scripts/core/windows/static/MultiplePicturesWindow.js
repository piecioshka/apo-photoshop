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

        this._selectedPictureIndex = 0;

        this.setup();
        this.initialize();
    };

    MultiplePicturesWindow.prototype = new root.AbstractWindow();

    MultiplePicturesWindow.prototype.initialize = function () {
        this.$window.classList.add('multiple-pictures-window');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this._buildStrip();
            // Add interactive as clicked image.
            this._addClickEvent();

            var fileNames = _.map(this.settings.pictures, function (frame) {
                return frame.name;
            }).join(', ');
            
            var countFiles = '(' + this.settings.pictures.length + ')';

            // Update title (add each file name).
            this.updateTitle(countFiles + ' ' + fileNames);

            // Append window list.
            root.App.windowManager.addWindow(this);

            this.emit(root.AbstractWindow.EVENTS.READY);
        });

        // Render window.
        this.render();
    };

    MultiplePicturesWindow.prototype._buildStrip = function () {
        var $strip = doc.createElement('div');
        $strip.classList.add('strip-axis');

        this.$content.appendChild($strip);
        this.$content = $strip;

        _.each(this.settings.pictures, function (picture, index) {
            this._addPicture(picture, index);
        }, this);
    };

    MultiplePicturesWindow.prototype._addPicture = function (picture, index) {
        // Append width of pictures list (use margin bottom).
        this._resizeStrip(picture.height + MultiplePicturesWindow.MARGIN_BOTTOM);

        // Create `Canvas` instance.
        var canvas = new root.Canvas({
            width: picture.width,
            height: picture.height
        });

        // Create $canvas space.
        canvas.render(this);

        // Put loaded image to canvas form.
        canvas.loadGrayScaleImage(picture.img, picture.width, picture.height);

        this.settings.pictures[index].canvas = canvas;
    };

    MultiplePicturesWindow.prototype._resizeStrip = function (size) {
        this.$content.style.height = (parseInt(this.$content.style.height, 10) || 0) + size + 'px';
    };

    MultiplePicturesWindow.prototype._addClickEvent = function () {
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

        function selectCanvas($element) {
            clearSelection();
            addSelection($element);

            // Get index of selected image.
            self._selectedPictureIndex = _.toArray($element.parentNode.children).indexOf($element);

            self.emit(MultiplePicturesWindow.EVENTS.SELECT_PICTURE, { picture: $element });
        }

        this.$content.addEventListener('click', function (evt) {
            var $element = evt.target;

            if (isCanvas($element)) {
                selectCanvas($element);
            }
        });

        // Add selection for first image.
        selectCanvas(this.$content.querySelector('canvas'));
    };

    MultiplePicturesWindow.prototype.getPictures = function () {
        return this.settings.pictures;
    };

    MultiplePicturesWindow.prototype.getCopyOfPictures = function () {
        return _.map(this.settings.pictures, function (picture) {
            return {
                file: picture.file,
                name: picture.name,
                height: picture.height,
                width: picture.width,
                img: picture.img,
                canvas: picture.canvas.copy()
            };
        });
    };

    MultiplePicturesWindow.prototype.getSelectedPicture = function () {
        return this.settings.pictures[this._selectedPictureIndex];
    };

    MultiplePicturesWindow.MARGIN_BOTTOM = 3;

    MultiplePicturesWindow.EVENTS = {
        SELECT_PICTURE: 'picture:select'
    };

    // Exports `MultiplePicturesWindow`.
    return (root.MultiplePicturesWindow = MultiplePicturesWindow);

}(this));
