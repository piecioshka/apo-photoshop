(function (root) {
    'use strict';

    var OperationsOnePoint = {

        // Operacje -> Jednopunktowe -> Odwrotność (negacja)
        onePointNegative: function (contextWindow) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            var i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // Negative value.
                color = 255 - color;

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Progowanie
        onePointThreshold: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            var i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // If more than holder returns 255 (white) otherwise 0 (black).
                color = (color > hold) ? 255 : 0;

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Redukcja poziomów szarości
        onePointPosterize: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var levels = parseInt(params.value, 10);

            var numOfAreas = 256 / levels;
            var numOfValues = 255 / (levels - 1);

            var i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // for more comments see http://www.axiomx.com/posterize.htm
                var colorAreaFloat = color / numOfAreas;
                var colorArea = parseInt(colorAreaFloat, 10);

                if (colorArea > colorAreaFloat) {
                    colorArea = colorArea - 1;
                }

                var newColorFloat = numOfValues * colorArea;
                var newColor = parseInt(newColorFloat, 10);

                if (newColor > newColorFloat) {
                    newColor = newColor - 1;
                }

                color = newColor;

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Rozciąganie
        onePointStretching: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var min = parseInt(params.value.min, 10);
            var max = parseInt(params.value.max, 10);

            var i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

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

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Regulacja jasnością
        onePointBrightnessRegulation: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            var i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                color += color * (hold / 100);

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Regulacja kontrastem
        onePointContrastRegulation: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            var uniquePixelsChannels = can.getUniqueChannels();
            var multiplier = (100.0 + hold) / 100.0;
            var lmax = (uniquePixelsChannels.length - 1);

            var i, color, temp;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                temp = (color / lmax) - 0.5;
                temp = temp * multiplier + 0.5;
                color = Math.max(0, Math.min(uniquePixelsChannels.length - 1, temp * lmax));

                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Regulacja korekcją gamma
        onePointGammaRegulation: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;
            var hold = parseInt(params.value, 10);

            var uniquePixelsChannels = can.getUniqueChannels();
            var upo = new Array(uniquePixelsChannels.length);
            var lmax = (uniquePixelsChannels.length - 1);

            var j, pos;

            for (j = 0; j < uniquePixelsChannels.length; ++j) {
                pos = (lmax * Math.pow(j / lmax, 1.0 / hold)) + 0.5;
                pos = Math.min(Math.max(pos, 0), uniquePixelsChannels.length - 1);
                upo[j] = pos;
            }

            var i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                color = upo[color];

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Operacje -> Jednopunktowe -> Arytmetyczne i Logiczne
        onePointArithmeticalLogical: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            var firstPicturePixels = params.firstPicture.canvas.getAllChannelsOfPixels();
            var secondPicturePixels = params.secondPicture.canvas.getAllChannelsOfPixels();

            var i, color, first, second;

            switch (params.operation) {
                case 'add':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = (first + second) / 2;

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'sub':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = Math.abs(first - second);

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'mul':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = (first * second) + first;

                        // Save protection (0 - 255).
                        color = root.Utilities.intToByte(color);

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;
                case 'or':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = first || second;

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'and':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = first && second;

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;

                case 'xor':
                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        first = firstPicturePixels[(i * 4)];
                        second = secondPicturePixels[(i * 4)];

                        color = first ^ second;

                        // Save protection (0 - 255).
                        color = root.Utilities.intToByte(color);

                        // Update each channel (RGB) of pixel.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                        // Alpha channel sets to opaque.
                        pixelsChannelsData[(i * 4) + 3] = 255;
                    }
                    break;
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        // Okno -> UOP
        onePointUOP: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var canCopy = params.copy.canvas;

            var pixelsChannels = canCopy.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            var i, color;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];

                // When current color is color from start position, change it to ending color.
                color = params.colors[color];

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Update <canvas>
            can.ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        }
    };

    // Exports `OperationsOnePoint`.
    return (root.OperationsOnePoint = OperationsOnePoint);

}(this));
