(function (root) {
    'use strict';

    var AssetsLoader = {
        loadImage: function (url) {
            var self = this;
            var img = new Image();

            img.addEventListener('load', function () {
                var attrs = {
                    image: img,
                    width: img.width,
                    height: img.height
                };
                self.emit(AssetsLoader.EVENTS.IMAGE_LOADED, attrs);
            });

            img.addEventListener('error', function () {
                throw new Error('AssetsLoader#loadImage: Problem with image load url: ' + url);
            });

            img.setAttribute('src', url);
        }
    };

    AssetsLoader.EVENTS = {
        IMAGE_LOADED: 'canvas:loadImage'
    };

    // Extend `AssetsLoader` module with events.
    _.extend(AssetsLoader, root.EventEmitter);

    // Export `AssetsLoader`.
    return (root.AssetsLoader = AssetsLoader);

}(this));
