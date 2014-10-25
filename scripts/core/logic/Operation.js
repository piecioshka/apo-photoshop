(function (root) {
    'use strict';

    var Operation = function () {
        return this;
    };

    Operation.prototype._getWorkspace = function () {
        var activeWindow = root.App.windowManager.getActiveWindow();

        // Support only picture window.
        if (!(activeWindow instanceof PictureWindow)) {
            return;
        }

        var title = activeWindow.getTitle();

        if (!(/^\* /).test(title)) {
            activeWindow.updateTitle('* ' + title);
        }

        return activeWindow;
    };

    Operation.prototype._flatteningHistogram = function (method) {
        console.assert(_.isNumber(method), 'Operation#_flatteningHistogram: `method` is not a number');

        var workspace = this._getWorkspace();

        // When you try do operation for non-picture window.
        if (!workspace) {
            return;
        }

        var can = workspace.canvas;
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
                case Operation.FLATTENING.MEDIUM:
                    // Reguła średnich
                    news[z] = ((left[z] + right[z]) / 2);
                    break;

                case Operation.FLATTENING.RANDOM:
                    // Reguła losowa
                    news[z] = right[z] - left[z];
                    break;

                case Operation.FLATTENING.NEIGHBOURHOOD:
                    // Reguła sąsiedztwa
                    news[z] = null;
                    break;

                case Operation.FLATTENING.CUSTOM:
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

        // Copy to array. References was destroyed.
        var pixelsArray = can.getCopyRedChannelPixels();

        var pixelsMatrix = CanvasHelper.toPixelMatrix(pixelsArray, can.settings.width);
        // console.log('pixelsMatrix');
        // console.table(pixelsMatrix);

        var pixelsWithBorder = CanvasHelper.completePixelArray(pixelsMatrix, -1);
        // console.log('pixelsWithBorder');
        // console.table(pixelsWithBorder);

        // 7 pkt.
        for (var i = 0; i < len / 4; i++) {
            var index = i * 4;
            var y = parseInt(i / can.settings.width, 10) + 1;
            var x = (i % can.settings.width) + 1;
            var ne = CanvasHelper.getNeighbors(pixelsWithBorder, x, y);
            var avg = Utilities.average.apply(this, ne);
            var max = Utilities.max.apply(this, ne);
            var color = 0;
            var val = pixelsChannelsData[index];

            // 8 pkt.
            if (left[val] === right[val]) {
                color = left[val];

            // 9 pkt.
            } else {
                switch (method) {
                    case Operation.FLATTENING.MEDIUM:
                        // Reguła średnich
                        color = news[val];
                        break;

                    case Operation.FLATTENING.RANDOM:
                        // Reguła losowa
                        color = _.random(0, news[val]) + left[val];
                        break;

                    case Operation.FLATTENING.NEIGHBOURHOOD:
                        // Reguła sąsiedztwa

                        if (avg > right[val]) {
                            color = right[val];
                        } else if (avg < left[val]) {
                            color = left[val];
                        } else {
                            color = avg;
                        }

                        break;

                    case Operation.FLATTENING.CUSTOM:
                        // Reguła dowolna

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
    };

    Operation.prototype.flatteningHistogramMedium = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda średnich');
        this._flatteningHistogram(Operation.FLATTENING.MEDIUM);
    };

    Operation.prototype.flatteningHistogramRandom = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda losowa');
        this._flatteningHistogram(Operation.FLATTENING.RANDOM);
    };

    Operation.prototype.flatteningHistogramNeighbourhood = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda sąsiedztwa');
        this._flatteningHistogram(Operation.FLATTENING.NEIGHBOURHOOD);
    };

    Operation.prototype.flatteningHistogramCustom = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda własna');
        this._flatteningHistogram(Operation.FLATTENING.CUSTOM);
    };

    Operation.prototype.useOnlyGreenColor = function () {
        console.info('Operacje -> Kolory -> Zielony');

        var workspace = this._getWorkspace();

        // When you try do operation for non-picture window.
        if (!workspace) {
            return;
        }

        var can = workspace.canvas;
        var ctx = can.ctx;

        var pixelsChannels = can.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        for (var i = 0; i < len / 4; i++) {
            pixelsChannelsData[(i * 4)]         = 0;    // R
            // pixelsChannelsData[(i * 4) + 1]  = 40;   // G
            pixelsChannelsData[(i * 4) + 2]     = 0;    // B
            // pixelsChannelsData[(i * 4) + 3]  = 1;    // A
        }

        ctx.putImageData(pixelsChannels, 0, 0);
    };

    Operation.prototype.onePointNegative = function () {
        console.info('Operacje -> Jednopunktowe -> Odwrotność');

        var workspace = this._getWorkspace();

        // When you try do operation for non-picture window.
        if (!workspace) {
            return;
        }

        var can = workspace.canvas;
        var ctx = can.ctx;

        var pixelsChannels = can.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        for (var i = 0; i < len / 4; i++) {
            var color = 255 - pixelsChannelsData[(i * 4)];

            // Update each channel (RGB) of pixel. Not modify channel alpha.
            pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
        }

        ctx.putImageData(pixelsChannels, 0, 0);
    };

    Operation.FLATTENING = {
        MEDIUM: 1,
        RANDOM: 2,
        NEIGHBOURHOOD: 3,
        CUSTOM: 4
    };

    // Exports `Operation`.
    return (root.Operation = Operation);

}(this));
