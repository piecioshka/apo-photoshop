(function (root) {
    'use strict';

    var OperationsNeighbourhood = {
        smoothing: function (params) {
            console.time('Neighbourhood: Smoothing');

            // @type {Array}
            var mask = params.mask;
            // @type {Object}
            var pic = params.picture;
            // @type {Canvas}
            var workspace = params.workspace;

            // Loading passed image to new Canvas.
            workspace.loadGrayScaleImage(pic.img, pic.width, pic.height);

            var can = workspace;
            var ctx = can.ctx;

            var pixelsChannels = can.getDataImage();
            var pixelsChannelsData = pixelsChannels.data;

            // Copy to array all channels. References was destroyed.
            var pixelsArray = can.getOneChannelOfPixels();

            // Convert list of pixels to matrix. Quicker calculation.
            var pixelsMatrix = root.CanvasHelper.toPixelMatrix(pixelsArray, can.settings.width);

            // Add border to matrix of pixels.
            var pixelsWithBorder = root.CanvasHelper.completePixelArray(pixelsMatrix, 0);

            var i = 0;

            _.each(pixelsMatrix, function (row, y) {
                _.each(row, function (color, x) {
                    var ne = root.CanvasHelper.getNeighbors(pixelsWithBorder, x + 1, y + 1);

                    var temp = 0;

                    // Multiply mask with neighbours.
                    _.each(ne, function (n, index) {
                        temp += n * mask[index];
                    });

                    // Update color.
                    color = temp;

                    // Save protection (0 - 255).
                    color = root.Utilities.intToByte(color);

                    // Update each channel (RGB) of pixel. Not modify channel alpha.
                    pixelsChannelsData[(i * 4)] = pixelsChannelsData[(i * 4) + 1] = pixelsChannelsData[(i * 4) + 2] = color;

                    i++;
                });
            });

            // Update <canvas>
            ctx.putImageData(pixelsChannels, 0, 0);

            console.timeEnd('Neighbourhood: Smoothing');
        },

        sharpen: function (params) {
            console.time('Neighbourhood: Sharpen');

            // @type {string}
            var type = params.type;
            // @type {Object}
            var pic = params.picture;
            // @type {Canvas}
            var workspace = params.workspace;

            // Loading passed image to new Canvas.
            workspace.loadGrayScaleImage(pic.img, pic.width, pic.height);

            var can = workspace;
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

            console.timeEnd('Neighbourhood: Sharpen');
        }
    };

    // Exports `OperationsNeighbourhood`.
    return (root.OperationsNeighbourhood = OperationsNeighbourhood);

}(this));
