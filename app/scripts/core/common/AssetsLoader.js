(function (root) {
    'use strict';

    var AssetsLoader = {
        SUPPORTED_EXTENSIONS: [
            /.\.png/i,
            /.\.jpg/i,
            /.\.jpeg/i,
            /.\.gif/i,
            /.\.bmp/i
        ],

        loadImage: function (file, callback, ctx) {
            this._useImageConstructor(file, callback.bind(ctx || this));
        },

        _useImageConstructor: function (file, callback) {
            var img = new root.Image();

            img.addEventListener('load', function () {
                callback({
                    img: img,
                    width: img.width,
                    height: img.height
                });
            });

            img.addEventListener('error', function () {
                throw new Error('AssetsLoader#_useImageConstructor: Problem with loading image: ' + file);
            });

            img.setAttribute('src', file);
        }

    };

    // Extend `AssetsLoader` module with events.
    _.extend(AssetsLoader, root.EventEmitter);

    // Export `AssetsLoader`.
    return (root.AssetsLoader = AssetsLoader);

}(this));
