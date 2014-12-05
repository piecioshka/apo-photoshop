/*global promise */

(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var FilmStockWindow = function (params) {
        // console.info('new FilmStockWindow', params);

        this.settings = {
            renderAreaID: '#app',
            frames: []
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(this.settings.renderAreaID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;

        // Flag tell that window is active.
        this.isActive = false;

        this.setup();
        this.initialize();
    };

    FilmStockWindow.prototype = new root.AbstractWindow();

    FilmStockWindow.prototype.initialize = function () {
        this.$window.classList.add('film-stock-window');

        // Update title of window.
        this.updateTitle('Taśma filmowa');

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildStrip();
        });

        // Render window.
        this.render();
    };

    FilmStockWindow.prototype.buildStrip = function () {
        var self = this;
        var frames = [];

        // Loop through each of file (images).
        _.each(this.settings.frames, function (frame) {

            var asyncLoad = function () {
                var p = new promise.Promise();

                // Load selected file.
                root.AssetsLoader.loadImage(frame.file, frame.name, function (params) {
                    self.addFrame(params);
                    p.done();
                });

                return p;
            };

            frames.push(asyncLoad);
        });

        promise.chain(frames).then(function () {
            console.log('film strip ready');
        });
    };

    FilmStockWindow.prototype.addFrame = function (frame) {
        console.log('add frame', frame);

        // Create `Canvas` instance.
        var canvas = new root.Canvas({
            width: frame.image.width,
            height: frame.image.height
        });

        // Create $canvas space.
        canvas.render(this);

        canvas.loadGrayScaleImage(frame.image, frame.width, frame.height);
    };

    // Exports `FilmStockWindow`.
    return (root.FilmStockWindow = FilmStockWindow);

}(this));
