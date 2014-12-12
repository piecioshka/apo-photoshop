(function (root) {
    'use strict';

    var OperationsOnePoint = {

        // Operacje -> Jednopunktowe -> Odwrotność (negacja)
        onePointNegative: function () {
            var workspace = root.OperationsHelper.getWorkspace();

            // When you try do operation for non-picture window.
            if (!workspace) {
                return;
            }

            console.time('One point: Negative');

            var can = workspace.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                // Negative value.
                color = 255 - color;

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
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

            // Update <canvas>
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

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Posterize');
        },

        // Operacje -> Jednopunktowe -> Rozciąganie
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

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Stretching');

        },

        // Operacje -> Jednopunktowe -> Regulacja jasnością
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
                // color = root.Utilities.intToByte(color + ((255 - color) * hold) % 255);

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: BrightnessRegulation');
        },

        // Operacje -> Jednopunktowe -> Regulacja kontrastem
        onePointContrastRegulation: function (params) {
            console.time('One point: ContrastRegulation');

            var can = params.workspace;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            var uniqueChannels = can.getUniqueChannels();
            var multiplier = (100.0 + hold) / 100.0;
            var lmax = (uniqueChannels.length - 1);

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                var temp = (color / lmax) - 0.5;
                temp = temp * multiplier + 0.5;
                color = Math.max(0, Math.min(uniqueChannels.length - 1, temp * lmax));

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: ContrastRegulation');
        },

        // Operacje -> Jednopunktowe -> Regulacja korekcją gamma
        onePointGammaRegulation: function (params) {
            console.time('One point: GammaRegulation');

            var can = params.workspace;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            var uniqueChannels = can.getUniqueChannels();
            var upo = new Array(uniqueChannels.length);
            var lmax = (uniqueChannels.length - 1);

            for (var j = 0; j < uniqueChannels.length; ++j) {
                var pos = (lmax * Math.pow(j / lmax, 1.0 / hold)) + 0.5;
                pos = Math.min(Math.max(pos, 0), uniqueChannels.length - 1);
                upo[j] = pos;
            }

            for (var i = 0; i < len / 4; i++) {
                var color = pixelsChannelsData[(i * 4)];

                color = upo[color];

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: GammaRegulation');
        },

        // Operacje -> Jednopunktowe -> Arytmetyczne
        onePointArithmetical: function (params) {
            console.time('One point: Arithmetical');

            var can = params.workspace;
            var ctx = can.ctx;

            can.markAsNotActive();

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            var firstPicture = params.pictures[0].canvas.getAllChannelsOfPixels();
            var secondPicture = params.pictures[1].canvas.getAllChannelsOfPixels();

            var i, color, first, second;

            switch (params.operation) {
                case 'add':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];

                        first = firstPicture[(i * 4)];
                        second = secondPicture[(i * 4)];

                        color = (first + second) / 2;

                        // Update each channel (RGB) of pixel. Not modify channel alpha.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
                    }
                    break;

                case 'sub':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];

                        first = firstPicture[(i * 4)];
                        second = secondPicture[(i * 4)];

                        color = Math.abs(first - second);

                        // Update each channel (RGB) of pixel. Not modify channel alpha.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
                    }
                    break;

                case 'mul':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];

                        first = firstPicture[(i * 4)];
                        second = secondPicture[(i * 4)];

                        color = (first * second) + first;

                        // Save protection (0 - 255).
                        color = root.Utilities.intToByte(color);

                        // Update each channel (RGB) of pixel. Not modify channel alpha.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
                    }
                    break;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Arithmetical');
        },

        // Operacje -> Jednopunktowe -> Logiczne
        onePointLogical: function (params) {
            console.time('One point: Logical');

            var can = params.workspace;
            var ctx = can.ctx;

            can.markAsNotActive();

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            var firstPicture = params.pictures[0].canvas.getAllChannelsOfPixels();
            var secondPicture = params.pictures[1].canvas.getAllChannelsOfPixels();

            var i, color, first, second;

            switch (params.operation) {
                case 'or':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];

                        first = firstPicture[(i * 4)];
                        second = secondPicture[(i * 4)];

                        color = first || second;

                        // Update each channel (RGB) of pixel. Not modify channel alpha.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
                    }
                    break;

                case 'and':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];

                        first = firstPicture[(i * 4)];
                        second = secondPicture[(i * 4)];

                        color = first && second;

                        // Update each channel (RGB) of pixel. Not modify channel alpha.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
                    }
                    break;

                case 'xor':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];

                        first = firstPicture[(i * 4)];
                        second = secondPicture[(i * 4)];

                        color = first ^ second;

                        // Save protection (0 - 255).
                        color = root.Utilities.intToByte(color);

                        // Update each channel (RGB) of pixel. Not modify channel alpha.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
                    }
                    break;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('One point: Logical');
        }
    };

    // Exports `OperationsOnePoint`.
    return (root.OperationsOnePoint = OperationsOnePoint);

}(this));
