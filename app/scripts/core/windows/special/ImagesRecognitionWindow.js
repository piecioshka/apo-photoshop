(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ImagesRecognitionWindow = function ImagesRecognitionWindow(contextWindow, params) {
        this.contextWindow = contextWindow;
        this.settings = {
            picture: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;
        this.isActive = false;

        this.setup(contextWindow);
        this.initialize();
    };

    ImagesRecognitionWindow.prototype = new root.AbstractWindow();

    ImagesRecognitionWindow.prototype.initialize = function () {
        this.$window.classList.add('images-recognition-window');

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI();

            // Update title (add each file name).
            this.updateTitle(root.Locale.get('TOOLS_IMAGES_RECOGNITION') + ' - ' + _.map(this.settings.pictures, function (frame) {
                return frame.name;
            }).join(', '));
        });

        // Render window.
        this.render();
    };

    ImagesRecognitionWindow.prototype.buildUI = function () {
        var self = this;
        console.log(this.settings.picture);
    };

    // Exports `ImagesRecognitionWindow`.
    return (root.ImagesRecognitionWindow = ImagesRecognitionWindow);

}(this));
