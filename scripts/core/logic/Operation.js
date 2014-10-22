(function (root) {
    'use strict';

    var Operation = function () {
        return this;
    };

    Operation.prototype.flatteningHistogramMedium = function () {
        var activeWindow = root.App.windowManager.getActiveWindow();

        // Support only picture window.
        if (!(activeWindow instanceof PictureWindow)) {
            return;
        }

        console.log('Operacje -> Wygładzanie histogram -> Metoda średnich');

        var can = activeWindow.canvas;
        var ctx = activeWindow.canvas.ctx;

        var red = [], green = [], blue = [], alpha = [];

        var theImage = ctx.getImageData(0, 0, can.$canvas.width, can.$canvas.height);

        var pix = theImage.data;

        // Separate out red, green, blue, and alpha values.
        // Every four values equals 1 pixel.
        for (i = 0; i < pix.length; i += 4) {
            red[i / 4]      = pix[i];
            green[i / 4]    = pix[i + 1];
            blue[i / 4]     = pix[i + 2];
            alpha[i / 4]    = pix[i + 3];
        }

        // Check each pixel's RGB value.
        for (var i = 0, len = can.width * can.height; i < len; i++) {
            if (red[i] === 0 && green[i] == 255 && blue[i] === 0) {
                // Set alpha value for pixel to 0.
                pix[(i * 4) + 3] = 0;
            }
        }

        // Blit modified image object to screen.
        ctx.putImageData(theImage, 0, 0);

        var imageWindow = new PictureWindow({
            image: activeWindow.settings.image
        });

        imageWindow.updateTitle('*' + imageWindow.getTitle());
    };

    Operation.prototype.flatteningHistogramRandom = function () {
        var activeWindow = root.App.windowManager.getActiveWindow();

        // Support only picture window.
        if (!(activeWindow instanceof PictureWindow)) {
            return;
        }

        console.log('Operacje -> Wygładzanie histogram -> Metoda losowa');

        var imageWindow = new PictureWindow({
            image: activeWindow.settings.image
        });
    };

    Operation.prototype.flatteningHistogramNeighbourhood = function () {
        var activeWindow = root.App.windowManager.getActiveWindow();

        // Support only picture window.
        if (!(activeWindow instanceof PictureWindow)) {
            return;
        }

        console.log('Operacje -> Wygładzanie histogram -> Metoda sąsiedztwa');

        var imageWindow = new PictureWindow({
            image: activeWindow.settings.image
        });
    };

    Operation.prototype.flatteningHistogramCustom = function () {
        var activeWindow = root.App.windowManager.getActiveWindow();

        // Support only picture window.
        if (!(activeWindow instanceof PictureWindow)) {
            return;
        }

        console.log('Operacje -> Wygładzanie histogram -> Metoda własna');

        var imageWindow = new PictureWindow({
            image: activeWindow.settings.image
        });
    };

    // Exports `Operation`.
    return (root.Operation = Operation);

}(this));
