(function (root) {
    'use strict';

    var Operation = function () {
        return this;
    };

    Operation.prototype._copyWorkspace = function (cb) {
        var activeWindow = root.App.windowManager.getActiveWindow();

        // Support only picture window.
        if (!(activeWindow instanceof PictureWindow)) {
            return;
        }

        var imageWindow = new PictureWindow({
            image: activeWindow.settings.image
        });

        imageWindow.on(PictureWindow.EVENTS.RENDER_IMAGE, function () {
            cb(imageWindow);
        });

        imageWindow.updateTitle('* ' + imageWindow.getTitle());
    };

    Operation.prototype.useOnlyGreenColor = function () {
        console.info('Operacje -> Kolory -> Zielony');

        this._copyWorkspace(function (workspace) {
            var can = workspace.canvas;
            var ctx = can.ctx;

            var pixels = can.getDataImage();
            var pixelsData = pixels.data;
            var len = pixelsData.length;

            for (var i = 0; i < len; i++) {
                pixelsData[(i * 4)]         = 0;    // R
                // pixelsData[(i * 4) + 1]  = 40;   // G
                pixelsData[(i * 4) + 2]     = 0;    // B
                // pixelsData[(i * 4) + 3]  = 1;    // A
            }

            ctx.putImageData(pixels, 0, 0);
        });
    };

    Operation.prototype.flatteningHistogramMedium = function () {
        console.info('Operacje -> Wygładzanie histogram -> Metoda średnich');

        this._copyWorkspace(function (workspace) {
            var can = workspace.canvas;

            // Maksymalny poziom
            var l = 255;

            // Stare poziomy
            var h = can.getHistogram();
            console.log('h (%d)', h.length, h);

            // Nowe poziomy
            var r = new Array(h.length);

            var average = can.getHistogramAverage();
            console.log('average', average);
        });
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
