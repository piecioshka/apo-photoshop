(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var PosterizeTool = function PosterizeTool(params) {
        // console.info('new PosterizeTool', params);

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

        this.setup();
        this.initialize();
    };

    PosterizeTool.prototype = new AbstractWindow();

    PosterizeTool.prototype.initialize = function () {
        this.$window.classList.add('posterize-tool');

        // Update title of window.
        this.updateTitle('Posteryzacja - ' +  this.settings.picture.name);

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI();
        });

        // Render window.
        this.render();
    };

    PosterizeTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-posterize-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range = self.$content.querySelector('.posterize-tool-regulation-range');
            var $value = self.$content.querySelector('.posterize-tool-regulation-value');

            function setupPosterize(levels) {
                // Restore image to origin.
                self.settings.picture.canvas.loadGrayScaleImage(self.settings.picture.img, self.settings.picture.width, self.settings.picture.height);

                // Apply posterize to image.
                root.OperationsOnePoint.onePointPosterize({
                    workspace: self.settings.picture.canvas,
                    value: levels
                });
            }

            $range.addEventListener('change', function () {
                $value.value = $range.value;
                setupPosterize($range.value);
            });

            $value.addEventListener('keydown', function () {
                $range.value = $value.value;
                setupPosterize($range.value);
            });

            $value.value = $range.value = PosterizeTool.DEFAULT_LEVEL;
            setupPosterize(PosterizeTool.DEFAULT_LEVEL);

            // Set focus on main dynamic element.
            $range.focus();
        }, 0);
    };

    PosterizeTool.DEFAULT_LEVEL = 128;

    // Exports `PosterizeTool`.
    return (root.PosterizeTool = PosterizeTool);

}(this));
