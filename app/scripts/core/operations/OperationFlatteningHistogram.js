(function (root) {
    'use strict';
    
    var OperationFlatteningHistogram = {

        _flatteningHistogram: function (method) {
            console.assert(_.isNumber(method), 'OperationFlatteningHistogram#_flatteningHistogram: `method` is not a number');

            var workspace = root.OperationHelper.getWorkspace();

            // When you try do operation for non-picture window.
            if (!workspace) {
                return;
            }

            var can = workspace.settings.picture.canvas;
            var ctx = can.ctx;

            // Stage 1 - Convert old level to new levels.
            // ------------------------------------------

            var h = can.getHistogram();
            var havg = can.getHistogramAverage();
            var hint = 0;

            var left = [];
            var right = [];
            var news = [];

            // 2 pkt.
            for (var z = 0, r = 0; z < h.length; ++z) {
                // Reset value.
                left[z] = right[z] = news[z] = 0;

                // 3 pkt.
                left[z] = r;
                hint += h[z] || 0;

                // 4 pkt.
                while (hint > havg) {
                    // 5 pkt.
                    hint -= havg;
                    r++;
                }

                // 6 pkt.
                right[z] = r;

                switch (method) {
                    case OperationFlatteningHistogram.FLATTENING.MEDIUM:
                        // Reguła średnich
                        news[z] = ((left[z] + right[z]) / 2);
                        break;

                    case OperationFlatteningHistogram.FLATTENING.RANDOM:
                        // Reguła losowa
                        news[z] = right[z] - left[z];
                        break;

                    case OperationFlatteningHistogram.FLATTENING.NEIGHBOURHOOD:
                        // Reguła sąsiedztwa
                        news[z] = null;
                        break;

                    case OperationFlatteningHistogram.FLATTENING.CUSTOM:
                        // Reguła dowolna
                        news[z] = (left[z] > right[z]) ? left[z] : right[z];
                        break;
                }
            }

            // Stage 2 - Calculate new image.
            // ------------------------------

            var pixelsChannels = can.getDataImage();

            // Reference to origin canvas.
            var pixelsChannelsData = pixelsChannels.data;

            // Count a number of pixels multiply 4 channels.
            var len = pixelsChannelsData.length;

            // Copy to array all channels. References was destroyed.
            var pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix. Quicker calculation.
            var pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, can.settings.width);

            // Add border to matrix of pixels.
            var pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, -1);

            // 7 pkt.
            for (var i = 0; i < len / 4; i++) {
                var ne, avg, max;

                var index = i * 4;
                var y = Math.floor(i / can.settings.width) + 1;
                var x = (i % can.settings.height) + 1;
                var color = 0;
                var val = pixelsChannelsData[index];

                // 8 pkt.
                if (left[val] === right[val]) {
                    color = left[val];

                    // 9 pkt.
                } else {
                    switch (method) {
                        case OperationFlatteningHistogram.FLATTENING.MEDIUM:
                            // Reguła średnich
                            color = news[val];
                            break;

                        case OperationFlatteningHistogram.FLATTENING.RANDOM:
                            // Reguła losowa
                            color = _.random(0, news[val]) + left[val];
                            break;

                        case OperationFlatteningHistogram.FLATTENING.NEIGHBOURHOOD:
                            // Reguła sąsiedztwa

                            ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x, y);
                            avg = root.Utilities.average.apply(this, ne);

                            if (avg > right[val]) {
                                color = right[val];
                            } else if (avg < left[val]) {
                                color = left[val];
                            } else {
                                color = avg;
                            }

                            break;

                        case OperationFlatteningHistogram.FLATTENING.CUSTOM:
                            // Reguła dowolna

                            ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x, y);
                            max = root.Utilities.max.apply(this, ne);

                            if (max > right[val]) {
                                color = right[val];
                            } else if (max < left[val]) {
                                color = left[val];
                            } else {
                                color = max;
                            }

                            break;
                    }
                }

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);
        },

        // Operacje -> Wygładzanie histogram -> Metoda średnich
        flatteningHistogramMedium: function () {
            console.time('Flattening Histogram: Medium');
            this._flatteningHistogram(OperationFlatteningHistogram.FLATTENING.MEDIUM);
            console.timeEnd('Flattening Histogram: Medium');
        },

        // Operacje -> Wygładzanie histogram -> Metoda losowa
        flatteningHistogramRandom: function () {
            console.time('Flattening Histogram: Random');
            this._flatteningHistogram(OperationFlatteningHistogram.FLATTENING.RANDOM);
            console.timeEnd('Flattening Histogram: Random');
        },

        // Operacje -> Wygładzanie histogram -> Metoda sąsiedztwa
        flatteningHistogramNeighbourhood: function () {
            console.time('Flattening Histogram: Neighbourhood');
            this._flatteningHistogram(OperationFlatteningHistogram.FLATTENING.NEIGHBOURHOOD);
            console.timeEnd('Flattening Histogram: Neighbourhood');
        },

        // Operacje -> Wygładzanie histogram -> Metoda własna
        flatteningHistogramCustom: function () {
            console.time('Flattening Histogram: Custom');
            this._flatteningHistogram(OperationFlatteningHistogram.FLATTENING.CUSTOM);
            console.timeEnd('Flattening Histogram: Custom');
        }
    };

    OperationFlatteningHistogram.FLATTENING = {
        MEDIUM: 1,
        RANDOM: 2,
        NEIGHBOURHOOD: 3,
        CUSTOM: 4
    };

    // Exports `OperationFlatteningHistogram`.
    return (root.OperationFlatteningHistogram = OperationFlatteningHistogram);

}(this));
