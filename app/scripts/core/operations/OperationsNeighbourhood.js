(function (root) {
    'use strict';

    var OperationsNeighbourhood = {
        smoothing: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;
            var mask = params.mask;
            var type = params.type;
            var sum = root.Utilities.sum(mask) || 1;
            var scale = params.scale;
            var width = can.settings.width;
            var height = can.settings.height;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            // Get only first channel per each pixel from image.
            var pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix for quicker calculation.
            var pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, width);

            // Add border to matrix of pixels.
            var pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, 0);

            var i, color, x, y, dimensions, ne;

            function calculateMask(ne) {
                var temp = 0;

                // Multiply mask with neighbours.
                _.each(ne, function (n, index) {
                    temp += (n * mask[index] / sum);
                });

                return temp;
            }

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];
                dimensions = root.CanvasHelper.convertPositionIndexToXY(width, height, i);

                x = dimensions.x;
                y = dimensions.y;

                ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x + 1, y + 1);

                // Update color.
                color = calculateMask(ne);

                // Support only 'Filtracja górnoprzepustowa'.
                if (type === 'fg') {
                    switch (scale) {
                        case 'ternary':
                            if (color > 0) {
                                color = 255;
                            } else if (color < 0) {
                                color = 0;
                            } else {
                                color = 127;
                            }
                            break;

                        case 'cutting':
                            color = root.Utilities.intToByte(color);
                            break;
                    }
                }

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
            }

            // Support only 'Filtracja górnoprzepustowa'.
            if (type === 'fg') {
                var uniquePixelsChannels = can.getUniqueChannels();

                if (scale === 'proportion') {
                    var min = _.first(uniquePixelsChannels);
                    var max = _.last(uniquePixelsChannels);

                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];

                        if (color > max) {
                            max = color;
                        } else if (color < min) {
                            min = color;
                        }
                    }

                    var difference = max - min;

                    for (i = 0; i < len / 4; i++) {
                        color = pixelsChannelsData[(i * 4)];
                        color = parseInt(((color - min) / difference) * 255, 10);

                        if (color < 0) {
                            color = 0;
                        } else if (color > 255) {
                            color = 255;
                        }

                        // Update each channel (RGB) of pixel. Not modify channel alpha.
                        pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;
                    }
                }
            }

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        },

        sharpen: function (contextWindow, params) {
            var type = params.type;
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;

            // Copy to array all channels. References was destroyed.
            var pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix. Quicker calculation.
            var pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, can.settings.width);

            var i = 0;

            _.each(pixelsMatrix, function (row, y) {
                _.each(row, function (color, x) {
                    var ne = root.CanvasHelper.getNeighbors(pixelsMatrix, x, y);

                    // Sorting for calculate median.
                    ne = ne.sort(root.Utilities.sortNumbers);

                    switch (type) {
                        case 'med':
                            // Calculate middle value.
                            var mid = (ne.length - 1) / 2;

                            // Update color.
                            if (ne.length % 2 === 1) {
                                color = ne[mid];
                            } else {
                                color = Math.round((ne[Math.ceil(mid)] + ne[Math.floor(mid)]) / 2);
                            }
                            break;

                        case 'min':
                            color = ne[0];
                            break;

                        case 'max':
                            color = ne[ne.length - 1];
                            break;
                    }

                    // Save protection (0 - 255).
                    color = root.Utilities.intToByte(color);

                    // Update each channel (RGB) of pixel. Not modify channel alpha.
                    pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                    i++;
                });
            });

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            // Inform picture window that is modified.
            contextWindow.setModifiedState();
        }
    };

    // Exports `OperationsNeighbourhood`.
    return (root.OperationsNeighbourhood = OperationsNeighbourhood);

}(this));
