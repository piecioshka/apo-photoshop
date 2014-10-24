(function (root) {
    'use strict';

    var CanvasHelper = {

        /**
         * Wrap pixels with passed border.
         *
         * @param {Array} pixels
         * @param {number} width
         * @param {number} height
         * @param {number|string} border
         * @returns {Array}
         */
        completePixelList: function (pixels, width, height, border) {
            var complement = [];
            var k = width + 2;

            _.times(k, function () {
                complement.push(border);
            });

            for (var i = 0; i < pixels.length; i += width) {
                complement.push(border);
                complement.push.apply(complement, pixels.slice(i, i + width));
                complement.push(border);
            }

            _.times(k, function () {
                complement.push(border);
            });

            return complement;
        },

        /**
         * Wrap pixels with passed border.
         *
         * @param {Array} pixels
         * @param {number|string} border
         * @returns {Array}
         */
        completePixelArray: function (pixels, border) {
            var complement = [];
            var k = pixels[0].length + 2;
            var borderRow = [];

            _.times(k, function () {
                borderRow.push(border);
            });

            complement.push(borderRow);

            for (var i = 0; i < pixels.length; i++) {
                var row = [];

                row.push(border);
                row.push.apply(row, pixels[i]);
                row.push(border);

                complement.push(row);
            }

            complement.push(borderRow);

            return complement;
        },

        /**
         * Returns two-dimensions array with pixels.
         *
         * @param {Array} list Pixels.
         * @param {number} width Width of matrix.
         * @returns {Array}
         */
        toPixelMatrix: function (list, width) {
            console.assert(list.length % width === 0, 'CanvasHelper#toPixelMatrix: `passed` width is not divide a list without tail.');

            var matrix = [];

            for (var i = 0; i < list.length; i += width) {
                var row = list.slice(i, i + width);
                matrix.push(row);
            }

            return matrix;
        },

        /**
         * Get values of neighbors.
         *
         * @param {Array} pixelsArray
         * @param {number} x
         * @param {number} y
         * @returns {Array}
         */
        getNeighbors: function (pixelsArray, x, y) {
            var neighbors = [];

            // Top row.
            neighbors.push(pixelsArray[x - 1][y - 1]);
            neighbors.push(pixelsArray[x][y - 1]);
            neighbors.push(pixelsArray[x + 1][y - 1]);

            // Same level.
            neighbors.push(pixelsArray[x - 1][y]);
            // neighbors.push(array[x][y - 1]);
            neighbors.push(pixelsArray[x + 1][y]);

            // Bottom row.
            neighbors.push(pixelsArray[x - 1][y + 1]);
            neighbors.push(pixelsArray[x][y + 1]);
            neighbors.push(pixelsArray[x + 1][y + 1]);

            return neighbors;
        }

    };

    // Exports `CanvasHelper`.
    return (root.CanvasHelper = CanvasHelper);

}(this));
