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
            _.assert(list.length % width === 0, 'CanvasHelper#toPixelMatrix: `passed` width is not divide a list without tail.');

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
         * @param {string} [figure='square'] ('square' | 'diamond')
         * @returns {Array}
         */
        getNeighbors: function (pixelsArray, x, y, figure) {
            var point;
            var neighbors = [];
            var max = pixelsArray.length - 1;

            figure = figure || 'square';

            function tryAdd(point) {
                if (_.isNumber(point) && point !== -1) {
                    neighbors.push(point);
                }
            }

            function isSquare() {
                return (figure === 'square');
            }

            function isDiamond() {
                return (figure === 'diamond');
            }

            // Top row.
            // --------

            if (y > 0) {
                if (x > 0 && isSquare()) {
                    point = pixelsArray[y - 1][x - 1];
                    tryAdd(point);
                }

                if (isSquare() || isDiamond()) {
                    point = pixelsArray[y - 1][x];
                    tryAdd(point);
                }

                if (x < max && isSquare()) {
                    point = pixelsArray[y - 1][x + 1];
                    tryAdd(point);
                }
            }

            // Same level.
            // -----------

            if (y >= 0 && y <= max) {
                if (x > 0 && (isSquare() || isDiamond())) {
                    point = pixelsArray[y][x - 1];
                    tryAdd(point);
                }

                if (isSquare() || isDiamond()) {
                    point = pixelsArray[y][x];
                    tryAdd(point);
                }

                if (x < max && (isSquare() || isDiamond())) {
                    point = pixelsArray[y][x + 1];
                    tryAdd(point);
                }
            }

            // Bottom row.
            // -----------

            if (y < max) {
                if (x > 0 && isSquare()) {
                    point = pixelsArray[y + 1][x - 1];
                    tryAdd(point);
                }

                if (isSquare() || isDiamond()) {
                    point = pixelsArray[y + 1][x];
                    tryAdd(point);
                }

                if (x < max && isSquare()) {
                    point = pixelsArray[y + 1][x + 1];
                    tryAdd(point);
                }
            }

            return neighbors;
        },

        convertPositionIndexToXY: function (width, height, i) {
            return {
                x: i % width,
                y: parseInt(i / width, 10)
            };
        }

    };

    // Exports `CanvasHelper`.
    return (root.CanvasHelper = CanvasHelper);

}(this));
