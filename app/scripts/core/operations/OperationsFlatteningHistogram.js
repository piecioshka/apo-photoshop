(function (root) {
    'use strict';

    var OperationsFlatteningHistogram = {

        _flatteningHistogram: function (contextWindow, method) {
            _.assert(_.isNumber(method), 'OperationsFlatteningHistogram#_flatteningHistogram: `method` is not a number');

            var z, r;
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            // Stage 1 - Convert old level to new levels.
            // ------------------------------------------

            var h = can.getCountingColorList();
            var havg = ~~root.Utilities.average.apply(this, h);
            var hint = 0;

            var left = [];
            var right = [];
            var news = [];

            // 2 pkt.
            for (z = 0, r = 0; z < h.length; ++z) {
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
                    case OperationsFlatteningHistogram.FLATTENING.MEDIUM:
                        // Reguła średnich
                        news[z] = ((left[z] + right[z]) / 2);
                        break;

                    case OperationsFlatteningHistogram.FLATTENING.RANDOM:
                        // Reguła losowa
                        news[z] = right[z] - left[z];
                        break;

                    case OperationsFlatteningHistogram.FLATTENING.NEIGHBOURHOOD:
                        // Reguła sąsiedztwa
                        news[z] = null;
                        break;

                    case OperationsFlatteningHistogram.FLATTENING.CUSTOM:
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

            var i, ne, avg, max, index, y, x, color, val;

            // 7 pkt.
            for (i = 0; i < len / 4; i++) {
                index = i * 4;
                y = Math.floor(i / can.settings.width) + 1;
                x = (i % can.settings.height) + 1;
                color = 0;
                val = pixelsChannelsData[index];

                // 8 pkt.
                if (left[val] === right[val]) {
                    color = left[val];

                // 9 pkt.
                } else {
                    switch (method) {
                        case OperationsFlatteningHistogram.FLATTENING.MEDIUM:
                            // Reguła średnich
                            color = news[val];
                            break;

                        case OperationsFlatteningHistogram.FLATTENING.RANDOM:
                            // Reguła losowa
                            color = _.random(0, news[val]) + left[val];
                            break;

                        case OperationsFlatteningHistogram.FLATTENING.NEIGHBOURHOOD:
                            // Reguła sąsiedztwa

                            ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x, y);
                            avg = ~~root.Utilities.average.apply(this, ne);

                            if (avg > right[val]) {
                                color = right[val];
                            } else if (avg < left[val]) {
                                color = left[val];
                            } else {
                                color = avg;
                            }

                            break;

                        case OperationsFlatteningHistogram.FLATTENING.CUSTOM:
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

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Wygładzanie histogram -> Metoda średnich
        flatteningHistogramMedium: function (contextWindow) {
            this._flatteningHistogram(contextWindow, OperationsFlatteningHistogram.FLATTENING.MEDIUM);
        },

        // Operacje -> Wygładzanie histogram -> Metoda losowa
        flatteningHistogramRandom: function (contextWindow) {
            this._flatteningHistogram(contextWindow, OperationsFlatteningHistogram.FLATTENING.RANDOM);
        },

        // Operacje -> Wygładzanie histogram -> Metoda sąsiedztwa
        flatteningHistogramNeighbourhood: function (contextWindow) {
            this._flatteningHistogram(contextWindow, OperationsFlatteningHistogram.FLATTENING.NEIGHBOURHOOD);
        },

        // Operacje -> Wygładzanie histogram -> Metoda własna
        flatteningHistogramCustom: function (contextWindow) {
            this._flatteningHistogram(contextWindow, OperationsFlatteningHistogram.FLATTENING.CUSTOM);
        }
    };

    OperationsFlatteningHistogram.FLATTENING = {
        MEDIUM: 1,
        RANDOM: 2,
        NEIGHBOURHOOD: 3,
        CUSTOM: 4
    };

    // Exports `OperationsFlatteningHistogram`.
    return (root.OperationsFlatteningHistogram = OperationsFlatteningHistogram);

}(this));
