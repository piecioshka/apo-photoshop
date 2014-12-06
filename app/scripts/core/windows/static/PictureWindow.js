(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var PictureWindow = function PictureWindow(params) {
        // console.info('new PictureWindow', params);

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

        this.setup();
        this.initialize();
    };

    PictureWindow.prototype = new root.AbstractWindow();

    PictureWindow.prototype.initialize = function () {
        this.$window.classList.add('picture-window');

        // Update title of window.
        this.updateTitle(this.settings.picture.name);

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Load picture and put to <canvas>
            this.loadPicture();
        }, this);

        // Render window.
        this.render();
    };

    PictureWindow.prototype.loadPicture = function () {
        root.AssetsLoader.loadImage(this.settings.picture.file, this.settings.picture.name, function (image) {
            _.extend(this.settings.picture, image);

            this.buildImage();
            this.paintImage();
        }, this);
    };

    PictureWindow.prototype.buildImage = function () {
        // Create `Canvas` instance.
        this.settings.picture.canvas = new root.Canvas({
            width: this.settings.picture.width,
            height: this.settings.picture.height
        });

        // Create $canvas space.
        this.settings.picture.canvas.render(this);
    };

    PictureWindow.prototype.paintImage = function () {
        this.settings.picture.canvas.loadGrayScaleImage(this.settings.picture.img, this.settings.picture.width, this.settings.picture.height);
    };

    // Exports `PictureWindow`.
    return (root.PictureWindow = PictureWindow);

}(this));
