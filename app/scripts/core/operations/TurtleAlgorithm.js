(function (root) {
    'use strict';

    var TurtleAlgorithm = function (contextWindow) {
        root.Status.wait();

        var can = contextWindow.settings.picture.canvas;
        var width = can.settings.width;
        var height = can.settings.height;

        var kier = 2;
        var x = 0, y = 0;
        var found = false;
        var startX, startY;

        var tab2 = new Array(height);
        var h = _.clone(height);
        while (h--) tab2[h] = new Array(width);

        for (y = 1; y < height - 1; y++) {
            for (x = 1; x < width - 1; x++) {
                if ((can.getPixel(x - 1, y).b - can.getPixel(x, y).b) > 150) {
                    found = true;
                }

                if (found) {
                    break;
                }
            }

            if (found) {
                break;
            }
        }

        startX = x;
        startY = y;

        while (found == true) {
            if (can.getPixel(x, y).b < 150) {
                kier--;
                if (kier === 0) kier = 4;
            } else {
                kier++;
                if (kier === 5) kier = 1;
            }

            tab2[x][y] = 255;

            switch (kier) {
                case 1:
                    y--;
                    break;
                case 2:
                    x++;
                    break;
                case 3:
                    y++;
                    break;
                case 4:
                    x--;
                    break;
            }

            if (x === startX && y === startY) {
                found = false;
            }
        }

        can.each(function (i, j) {
            if (tab2[j][i] === 255) {
                can.setPixel(j, i, [255, 0, 0, 255]);
            }
        });

        // Inform picture window that is modified.
        contextWindow.setModifiedState();

        root.Status.idle();
    };

    // Exports `TurtleAlgorithm`.
    return (root.TurtleAlgorithm = TurtleAlgorithm);

}(this));
