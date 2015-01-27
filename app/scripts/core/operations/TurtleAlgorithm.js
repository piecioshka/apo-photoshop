(function (root) {
    'use strict';

    var TurtleAlgorithm = function (contextWindow, params) {
        var can = contextWindow.settings.picture.canvas;
        var width = can.settings.width;
        var height = can.settings.height;

        var startX, startY;
        var kier = 2;
        var x = 0;
        var y = 0;
        var found = false;
        var markColor = params.markColor;

        var tab2 = [];
        // Create two-dimension array.
        (function (w) {
            tab2 = new Array(w);
            while (w--) {
                tab2[w] = new Array(height);
            }
        }(width));

        // -------------------------------------------------------------------------------------------------------------

        // Start finding first pixel which will be edge start point.
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

        // When found first pixel, continue searching rest points.
        while (found === true) {
            if (can.getPixel(x, y).b < 150) {
                kier--;
                if (kier === 0) {
                    kier = 4;
                }
            } else {
                kier++;
                if (kier === 5) {
                    kier = 1;
                }
            }

            tab2[x][y] = 255;

            switch (kier) {
                case 1: y--; break;
                case 2: x++; break;
                case 3: y++; break;
                case 4: x--; break;
            }

            if ((x === startX && y === startY) || x < 0 || y < 0) {
                found = false;
            }
        }

        // -------------------------------------------------------------------------------------------------------------

        // Print founded pixels, which are path with edge.
        can.each(function (i, j) {
            if (tab2[i][j] === 255) {
                can.setPixel(i, j, markColor);
            }
        });

        // Alternative version of painting edge. Is too slow - disabled.
        /*
        (function () {
            var w = width - 1;
            var h = height - 1;

            function asyncPaint() {
                setTimeout(function () {
                    if (tab2[w][h] === 255) {
                        can.setPixel(w, h, markColor);
                    }
                    w--;

                    if (w === 0) {
                        w = width - 1;
                        h--;
                    }

                    if (h !== 0) {
                        asyncPaint();
                    }
                }, 0);
            }

            asyncPaint();
        }());
        */

        // Inform picture window that is modified.
        contextWindow.setModifiedState();
    };

    // Exports `TurtleAlgorithm`.
    return (root.TurtleAlgorithm = TurtleAlgorithm);

}(this));
