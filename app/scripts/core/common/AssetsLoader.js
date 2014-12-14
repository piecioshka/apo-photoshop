(function (root) {
    'use strict';

    var AssetsLoader = {
        UNSUPPORTED_EXTENSIONS: [
            /.\.tif(f?)/i
        ],

        loadImage: function (file, name, callback, ctx) {
            ctx = ctx || this;

            this._useImageConstructor(file, name, callback.bind(ctx));
        },

        _useImageConstructor: function (file, name, callback) {
            var img = new Image();

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
