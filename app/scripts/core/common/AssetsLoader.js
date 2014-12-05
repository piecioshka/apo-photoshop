(function (root) {
    'use strict';

    var isTIFF = (/.\.tif(f?)/i);

    var AssetsLoader = {

        loadImage: function (url, name, callback, ctx) {
            ctx = ctx || this;

            if (isTIFF.test(name)) {
                root.alert(root.locale.get('MSG_ERR_UNSUPPORTED'));
            } else {
                this._useImageConstructor(url, name, callback.bind(ctx));
            }
        },

        _useImageConstructor: function (url, name, callback) {
            var img = new Image();

            img.addEventListener('load', function () {
                callback({
                    image: img,
                    name: name,
                    width: img.width,
                    height: img.height
                });
            });

            img.addEventListener('error', function () {
                throw new Error('AssetsLoader#_useImageConstructor: Problem with loading image: ' + url);
            });

            img.setAttribute('src', url);
        }

    };

    // Extend `AssetsLoader` module with events.
    _.extend(AssetsLoader, root.EventEmitter);

    // Export `AssetsLoader`.
    return (root.AssetsLoader = AssetsLoader);

}(this));
