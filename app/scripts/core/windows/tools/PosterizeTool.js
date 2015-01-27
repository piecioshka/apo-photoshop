(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var PosterizeTool = function PosterizeTool(contextWindow, params) {
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

        this.setup();
        this.initialize();
    };

    PosterizeTool.prototype = new root.AbstractWindow();

    PosterizeTool.prototype.initialize = function () {
        this.$window.classList.add('posterize-tool');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI(function () {
                // Update title of window.
                this.updateTitle(root.Locale.get('OPERATIONS_ONE_POINT_POSTERIZE') + ' - ' +  this.settings.picture.name);

                // Append window list.
                root.App.windowManager.addWindow(this);

                this.emit(root.AbstractWindow.EVENTS.READY);
            });
        });

        // Render window.
        this.render();
    };

    PosterizeTool.prototype.buildUI = function (cb) {
        var self = this;
        var template = doc.querySelector('#template-posterize-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range = self.$content.querySelector('.posterize-tool-regulation-range');
            var $value = self.$content.querySelector('.posterize-tool-regulation-value');

            root.InputRangeHelper.bindKeyShortcuts($range);

            function setupPosterize(levels) {
                new root.Operation(function () {
                    // Restore image to origin.
                    self.contextWindow.setPrimaryState();

                    // Apply posterize to image.
                    root.OperationsOnePoint.onePointPosterize(self.contextWindow, {
                        value: levels
                    });
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

            if (_.isFunction(cb)) {
                cb.call(self);
            }
        }, 0);
    };

    PosterizeTool.DEFAULT_LEVEL = 256;

    // Exports `PosterizeTool`.
    return (root.PosterizeTool = PosterizeTool);

}(this));
