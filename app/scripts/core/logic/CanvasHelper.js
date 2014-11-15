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
            var point;
            var neighbors = [];

            // Top row.
            // --------

            if (x > 0 && y > 0) {
                point = pixelsArray[x - 1][y - 1];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            if (x < pixelsArray.length && y > 0) {
                point = pixelsArray[x][y - 1];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            if (x < pixelsArray.length - 1 && y > 0) {
                point = pixelsArray[x + 1][y - 1];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            // Same level.
            // -----------

            if (x > 0 && y < pixelsArray[0].length) {
                point = pixelsArray[x - 1][y];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            if (x < pixelsArray.length && y > 0) {
                point = pixelsArray[x][y];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            if (x < pixelsArray.length - 1 && y < pixelsArray[0].length) {
                point = pixelsArray[x + 1][y];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            // Bottom row.
            // -----------

            if (x > 0 && y < pixelsArray[0].length - 1) {
                point = pixelsArray[x - 1][y + 1];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            if (x < pixelsArray.length && y < pixelsArray[0].length - 1) {
                point = pixelsArray[x][y + 1];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            if (x < pixelsArray.length - 1 && y < pixelsArray[0].length -1) {
                point = pixelsArray[x + 1][y + 1];

                if (point !== -1) {
                    neighbors.push(point);
                }
            }

            return neighbors;
        }

    };

    // Exports `CanvasHelper`.
    return (root.CanvasHelper = CanvasHelper);

}(this));
