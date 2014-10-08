(function (root) {
    'use strict';

    var Picture = function (image) {
        this.image = image;
        this.canvas = null;

        this.initialize();
    };

    Picture.prototype.initialize = function () {
        // Create window container.
        var win = new InternalWindow({
            renderAreaID: '#app'
        });

        // Update title of window.
        win.updateTitle(this.image.name);

        // Append window list.
        root.App.windowManager.addWindow(win);

        // Create `Canvas` instance.
        this.canvas = new root.Canvas({
            width: this.image.width,
            height: this.image.height
        });

        // Set reference to window, where will be rendered.
        this.canvas.setWindow(win);

        // Create $canvas space.
        this.canvas.render();

        // Put image to canvas.
        this.buildImage();

        // Render window.
        win.render();
    };

    Picture.prototype.buildImage = function () {
        this.canvas.ctx.drawImage(this.image.image, 0, 0, this.image.width, this.image.height);
    };

    // Exports `Picture`.
    return (root.Picture = Picture);

}(this));
