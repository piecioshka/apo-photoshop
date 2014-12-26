(function (root) {
    'use strict';

    var OperationsNeighbourhood = {
        smoothing: function (contextWindow, params) {
            var can = contextWindow.settings.picture.canvas;
            var ctx = can.ctx;
            var mask = params.mask;
            var sum = root.Utilities.sum(mask) || 1;
            var type = params.type;
            var scale = params.scale;

            console.log('params', params);

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;
            var len = pixelsChannelsData.length;

            // Add border to matrix of pixels.
            // var pixelsWithBorder = root.CanvasHelper.completePixelList(_.toArray(pixelsChannelsData), can.settings.width, can.settings.height, 0);

            var pixelsArray = can.getOneChannelOfPixels();
            // console.log('pixelsArray', pixelsArray);

            // Convert list of pixels to matrix. Quicker calculation.
            var pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, can.settings.width);
            // console.log('pixelsMatrix', pixelsMatrix);

            var pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, 0);
            // console.log('pixelsWithBorder', pixelsWithBorder);

            var i, color, x, y, dimensions;

            for (i = 0; i < len / 4; i++) {
                color = pixelsChannelsData[(i * 4)];
                dimensions = root.CanvasHelper.convertPositionIndexToXY(can.settings.width, can.settings.height, i);

                x = dimensions.x;
                y = dimensions.y;

                var ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x + 1, y + 1);

                var temp = 0;

                // Multiply mask with neighbours.
                _.each(ne, function (n, index) {
                    temp += n * mask[index] / sum;
                });

                // Update color.
                color = temp;


                /*
                switch(scale) {
                    case 'proportion':
                        if (min == null || color < min) {
                            min = color;
                        }
                        if (max == null || color > max) {
                            max = color;
                        }
                        break;
                    case 'ternary':
                        color = (color > 255 ? 255 : (color < 0 ? 0 : 127));
                        break;
                    case 'cutting':
                        color = Math.max(0, Math.min(255, color));
                        break;
                */


                // Save protection (0 - 255).
                color = root.Utilities.intToByte(color);

                // Update each channel (RGB) of pixel. Not modify channel alpha.
                pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                // Alpha channel sets to opaque.
                // pixelsChannelsData[(i * 4) + 3] = 255;
            }

            /*
            if (scale === 'proportion') {
                for (i = 0; i < len / 4; i++) {
                    color = pixelsChannelsData[(i * 4)];
                    dimensions = root.CanvasHelper.convertPositionIndexToXY(can.settings.width, can.settings.height, i);

                    x = dimensions.x;
                    y = dimensions.y;

                    int sum = 0;

                    for (Point offset : neighbors3x3) {
                        sum += imgModelNoFilter.getPixelValue((int)(x + offset.getX()),(int)(y + offset.getY())) * mask[1+((int)offset.getY())][1+((int)offset.getX())];
                    }

                    int color = sum/maskSum;
                    color = (int) (((double)color-(double)min)/((double)max-(double)min)*255.0);

                    imgModel.setPixelValue(x, y, color);
                }
            }
            */

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
