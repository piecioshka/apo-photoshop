(function (root) {
    'use strict';

    var Picture = function (image) {
        this.image = image;
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
        var canvas = new root.Canvas({
            width: this.image.width,
            height: this.image.height
        });

        // Set reference to window, where will be rendered.
        canvas.setWindow(win);

        // Create $canvas space.
        canvas.render();

        // Put image to canvas.
        canvas.buildImage(this.image);

        // Render window.
        win.render();
    };

    // Exports `Picture`.
    return (root.Picture = Picture);

}(this));
