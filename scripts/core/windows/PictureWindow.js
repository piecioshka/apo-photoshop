(function (root) {
    'use strict';

    var extend = require('extend');

    // Aliases.
    var doc = root.document;

    var PictureWindow = function (params) {
        console.log('new PictureWindow', params);

        this.settings = extend({
            renderAreaID: '#app',
            image: null
        }, params);

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
        });

        // Render window.
        this.render();
    };

    PictureWindow.prototype.buildImage = function () {
        this.canvas.ctx.drawImage(this.settings.image.image, 0, 0, this.settings.image.width, this.settings.image.height);
    };

    // Exports `PictureWindow`.
    return (root.PictureWindow = PictureWindow);

}(this));
