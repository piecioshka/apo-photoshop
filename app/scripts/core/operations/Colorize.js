(function (root) {
    'use strict';

    var Colorize = function (contextWindow) {
        var can = contextWindow.settings.picture.canvas;
        var ctx = can.ctx;

        var objectColors = ObjectsRecognitionWindow.prototype._useValleyMethod(contextWindow.settings.picture);

        var pixelsChannels = can.getDataImage();
        var pixelsChannelsData = pixelsChannels.data;
        var len = pixelsChannelsData.length;

        var i, color, r, g, b;

        for (i = 0; i < len / 4; i++) {
            color = pixelsChannelsData[(i * 4)];

            if (!_.contains(objectColors, color)) {
                continue;
            }

            if (color > 240) {
                r = 107; g = 67; b = 155;
            } else if (color > 220) {
                r = 166; g = 68; b = 153;
            } else if (color > 200) {
                r = 228; g = 64; b = 151;
            } else if (color > 180) {
                r = 237; g = 27; b = 36;
            } else if (color > 160) {
                r = 243; g = 112; b = 32;
            } else if (color > 140) {
                r = 247; g = 143; b = 30;
            } else if (color > 120) {
                r = 255; g = 194; b = 15;
            } else if (color > 100) {
                r = 254; g = 242; b = 0;
            } else if (color > 80) {
                r = 141; g = 252; b = 7;
            } else if (color > 60) {
                r = 0; g = 168; b = 143;
            } else if (color > 40) {
                r = 0; g = 146; b = 206;
            } else if (color > 20) {
                r = 1; g = 84; b = 164;
            } else {
                r = 0; g = 0; b = 0;
            }

            // Update each channel (RGB) of pixel. Not modify channel alpha.
            pixelsChannelsData[(i * 4)] = r;
            pixelsChannelsData[(i * 4) + 1] = g;
            pixelsChannelsData[(i * 4) + 2] = b;
        }

        // Update <canvas>
        ctx.putImageData(pixelsChannels, 0, 0);

        // Inform picture window that is modified.
        contextWindow.setModifiedState();
    };

    // Exports `Colorize`.
    return (root.Colorize = Colorize);

}(this));
