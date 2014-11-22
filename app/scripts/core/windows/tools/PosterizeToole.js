(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var PosterizeTool = function PosterizeTool(params) {
        console.info('new PosterizeTool', params);

        this.settings = {
            renderAreaID: '#app',
            image: null,
            canvas: null
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

    PosterizeTool.prototype = new AbstractWindow();

    PosterizeTool.prototype.initialize = function () {
        this.$window.classList.add('posterize-tool');

        // Update title of window.
        this.updateTitle('Redukcja poziomów szarości - ' +  this.settings.image.name);

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
        var template = doc.querySelector('#posterize-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.setContent(renderedTemplate);

        setTimeout(function () {
            var $range = doc.querySelector('#posterize-tool-regulation');
            var $value = doc.querySelector('#posterize-tool-regulation-value');

            function setupPosterize(levels) {
                // Put number of posterize.
                $value.innerText = levels;

                // Restore image to origin.
                self.settings.canvas.ctx.drawImage(self.settings.image.image, 0, 0, self.settings.image.width, self.settings.image.height);

                // Apply posterize to image.
                root.OperationOnePoint.onePointPosterize({
                    workspace: self.settings.canvas,
                    value: levels
                });
            }

            $range.addEventListener('change', function () {
                setupPosterize($range.value);
            });

            setupPosterize(PosterizeTool.DEFAULT_LEVELS);
        }, 0);
    };

    PosterizeTool.DEFAULT_LEVELS = 128;

    // Exports `PosterizeTool`.
    return (root.PosterizeTool = PosterizeTool);

}(this));
