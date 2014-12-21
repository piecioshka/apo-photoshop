(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var UOPWindow = function UOPWindow(contextWindow, params) {
        // console.info('new UOPWindow', params);

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

    UOPWindow.prototype = new root.AbstractWindow();

    UOPWindow.prototype.initialize = function () {
        this.$window.classList.add('uop-window');

        // Update title of window.
        this.updateTitle(root.Locale.get('BOX_UOP') + ' - ' + this.settings.picture.name);

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildTable();
        });

        // Render window.
        this.render();
    };

    UOPWindow.prototype.buildTable = function () {
        var self = this;

        var pixels = this.settings.picture.canvas.getCountingColorList();
        console.log('pixels', pixels);

        _.each(pixels, function (item, index) {
            if (pixels[index] === 0) {
                delete pixels[index];
            }
        });

        var template = doc.querySelector('#template-uop-static').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled({
            pixels: pixels
        });

        this.appendContent(renderedTemplate);

        requestAnimationFrame(function () {
            var $inputs = self.$content.querySelectorAll('input[type="number"]');

            _.each($inputs, function ($input, index) {
                $input.addEventListener('change', function () {
                    var end = parseInt($input.value, 10);

                    console.log({ start: index, end: end});

                    root.OperationsOnePoint.onePointUOP(self.contextWindow, {
                        start: index,
                        end: end,
                        copy: self.settings.picture
                    });
                });
            });
        });
    };

    // Exports `UOPWindow`.
    return (root.UOPWindow = UOPWindow);

}(this));
