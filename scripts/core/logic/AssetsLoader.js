(function (root) {
    'use strict';

    var AssetsLoader = {
        loadImage: function (url, name) {
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
                throw new Error('AssetsLoader#loadImage: Problem with image load url: ' + url);
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
