(function (root) {
    'use strict';

    var OperationOnePoint = {

        // Operacje -> Jednopunktowe -> Odwrotność (negacja)
        onePointNegative: function () {
            var workspace = root.OperationHelper.getWorkspace();

            // When you try do operation for non-picture window.
            if (!workspace) {
                return;
            }

            console.time('One point: Negative');

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

            console.timeEnd('One point: Negative');
        },

        // Operacje -> Jednopunktowe -> Progowanie
        onePointThreshold: function (params) {
            console.time('One point: Threshold');

            var can = params.workspace;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                // If more than holder returns 255 (white) otherwise 0 (black).
                color = (color > hold) ? 255 : 0;

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Threshold');
        },

        // Operacje -> Jednopunktowe -> Redukcja poziomów szarości
        onePointPosterize: function (params) {
            console.time('One point: Posterize');

            var can = params.workspace;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var levels = parseInt(params.value, 10);

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                // Round ratio color by levels multiply by levels.
                color = Math.round(color / levels) * levels;

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Posterize');
        },

        onePointStretching: function (params) {
            console.time('One point: Stretching');

            var can = params.workspace;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var min = parseInt(params.value.min, 10);
            var max = parseInt(params.value.max, 10);

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                if (color <= min || color > max) {
                    color = 0;
                } else {
                    color = Math.round((color - min) * (255 / (max - min)));
                }

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Stretching');

        },

        onePointBrightnessRegulation: function (params) {
            console.time('One point: BrightnessRegulation');

            var can = params.workspace;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                color += color * (hold / 100);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: BrightnessRegulation');
        },

        onePointContrastRegulation: function () {

        },

        onePointGammaRegulation: function () {

        }
    };

    // Exports `OperationOnePoint`.
    return (root.OperationOnePoint = OperationOnePoint);

}(this));
