(function (root) {
    'use strict';

    var isTIFF = (/.\.tif(f?)/i);

    var AssetsLoader = {
        loadImage: function (url, name) {
            if (isTIFF.test(name)) {
                root.alert(root.locale.get('MSG_ERR_UNSUPPORTED'));
            } else {
                this._useImageConstructor(url, name);
            }
        },

        _useImageConstructor: function (url, name) {
            var self = this;
            var img = new Image();

            img.addEventListener('load', function () {
                self.emit(AssetsLoader.EVENTS.IMAGE_LOADED, {
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

    AssetsLoader.EVENTS = {
        IMAGE_LOADED: 'loadImage'
    };

    // Extend `AssetsLoader` module with events.
    _.extend(AssetsLoader, root.EventEmitter);

    // Export `AssetsLoader`.
    return (root.AssetsLoader = AssetsLoader);

}(this));
