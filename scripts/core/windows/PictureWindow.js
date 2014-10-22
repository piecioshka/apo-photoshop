(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var PictureWindow = function (params) {
        console.warn('new PictureWindow', params);

        this.settings = {
            renderAreaID: '#app',
            image: null
        };
        _.extend(this.settings, params);

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

    PictureWindow.prototype = new AbstractWindow();
    PictureWindow.prototype.constructor = PictureWindow;

    PictureWindow.prototype.initialize = function () {
        this.$window.classList.add('picture-window');

        // Update title of window.
        this.updateTitle(this.settings.image.name);

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Create `Canvas` instance.
        this.canvas = new root.Canvas({
            width: this.settings.image.width,
            height: this.settings.image.height
        });

        // Set reference to window, where will be rendered.
        this.canvas.setWindow(this);

        // Create $canvas space.
        this.canvas.render();

        // Listen on window render.
        this.on(AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildImage();
            // Trigger event after building image.
            this.emit(PictureWindow.EVENTS.RENDER_IMAGE);
        });

        // Render window.
        this.render();
    };

    PictureWindow.prototype.buildImage = function () {
        this.canvas.ctx.drawImage(this.settings.image.image, 0, 0, this.settings.image.width, this.settings.image.height);
    };

    PictureWindow.EVENTS = {
        RENDER_IMAGE: 'render-image'
    };

    // Exports `PictureWindow`.
    return (root.PictureWindow = PictureWindow);

}(this));
