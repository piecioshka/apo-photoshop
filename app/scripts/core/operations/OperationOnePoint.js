(function (root) {
    'use strict';

    var OperationOnePoint = {

        onePointNegative: function () {
            console.log('Operacje -> Jednopunktowe -> Odwrotność (negacja)');

            var workspace = OperationHelper.getWorkspace();

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

        onePointThreshold: function () {
            console.log('Operacje -> Jednopunktowe -> Progowanie');

            var workspace = OperationHelper.getWorkspace();

            // When you try do operation for non-picture window.
            if (!workspace) {
                return;
            }

            console.time('One point: Threshold');

            var can = workspace.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = prompt('Podaj próg');

            // Ignore when user not put anything
            if (!hold) { return; }

            // Cast to integer.
            hold = parseInt(hold, 10);

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                if (color > hold) {
                    color = hold;
                }

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Threshold');
        },

        onePointReductionGrayScale: function () {

        },

        onePointStretching: function () {

        },

        onePointBrightnessRegulation: function () {

        },

        onePointContrastRegulation: function () {

        },

        onePointGammaRegulation: function () {

        }
    };

    // Exports `OperationOnePoint`.
    return (root.OperationOnePoint = OperationOnePoint);

}(this));
