(function (root) {
    'use strict';

    var Operation = function () {
        return this;
    };

    Operation.prototype._copyWorkspace = function () {
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

    Operation.prototype.useOnlyGreenColor = function () {
        console.info('Operacje -> Kolory -> Zielony');

        var workspace = this._copyWorkspace();

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

    Operation.prototype.flatteningHistogramMedium = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda średnich');

        var workspace = this._copyWorkspace();
        var can = workspace.canvas;
        var ctx = can.ctx;

        var pixelsChannels = can.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        // Poziomy szarości
        var l = 256;

        // Tablica histogramu
        var h = can.getHistogram();

        // Średnia
        var havg = can.getHistogramAverage();

        // Całka histogramu
        var hint = 0;

        var left = [];
        var right = [];
        var news = [];

        // 2 pkt. Po wszystkich poziomach szarości
        for (var z = 0, r = 0; z < l; ++z) {
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

            // Reguła średnich
            news[z] = ((left[z] + right[z]) / 2);

            // Reguła losowa
            // news[z] = right[z] - left[z];

            // Reguła sąsiedztwa
            // news[z] = null;
        }

        for (var i = 0; i < len / 4; i++) {
            var color = 0;
            var val = pixelsChannelsData[(i * 4)];

            if (left[val] === right[val]) {
                color = left[val];
            } else {
                // Reguła średnich
                color = news[val];

                // Reguła losowa
                // color = _.random(0, news[val]) + left[val];

                // Reguła sąsiedztwa
                // color = ...
            }

            // Update
            pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
        }

        ctx.putImageData(pixelsChannels, 0, 0);
    };

    Operation.prototype.flatteningHistogramRandom = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda losowa');
    };

    Operation.prototype.flatteningHistogramNeighbourhood = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda sąsiedztwa');
    };

    Operation.prototype.flatteningHistogramCustom = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda własna');
    };

    // Exports `Operation`.
    return (root.Operation = Operation);

}(this));
