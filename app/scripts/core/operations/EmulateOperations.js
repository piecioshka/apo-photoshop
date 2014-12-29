(function (root) {
    'use strict';

    var EmulateOperations = {
        drawSquare: function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            if (!(activeWindow instanceof root.PictureWindow)) {
                return false;
            }

            var can = activeWindow.getPicture().canvas;
            var width = can.settings.width;
            var height = can.settings.height;
            var squareSize = Math.min(width, height);
            var size = squareSize - 1;

            var color = [255, 0, 0];

            can.each(function (x, y) {
                if (x < squareSize && y < squareSize) {
                    if (x === 0 || y === 0 || x === size || y === size) {
                        can.setPixel(x, y, color);
                    }
                }
            });

            return true;
        }
    };

    // Exports `EmulateOperations`.
    return (root.EmulateOperations = EmulateOperations);

}(this));
