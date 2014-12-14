(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var StretchTool = function StretchTool(contextWindow, params) {
        // console.info('new StretchTool', params);

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

    StretchTool.prototype = new AbstractWindow();

    StretchTool.prototype.initialize = function () {
        this.$window.classList.add('stretch-tool');

        // Update title of window.
        this.updateTitle(root.Locale.get('OPERATIONS_ONE_POINT_STRETCHING') + ' - ' +  this.settings.picture.name);

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

    StretchTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-stretch-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range1 = self.$content.querySelector('.stretch-tool-regulation-range-min');
            var $value1 = self.$content.querySelector('.stretch-tool-regulation-value-min');

            var $range2 = self.$content.querySelector('.stretch-tool-regulation-range-max');
            var $value2 = self.$content.querySelector('.stretch-tool-regulation-value-max');

            function setupPosterize(min, max) {
                // Restore image to origin.
                self.contextWindow.setPrimaryState();

                // Apply stretch to image.
                root.OperationsOnePoint.onePointStretching(self.contextWindow, {
                    value: {
                        min: min,
                        max: max
                    }
                });
            }

            $range1.addEventListener('change', function () {
                $value1.value = $range1.value;
                setupPosterize($range1.value, $range2.value);
            });

            $value1.addEventListener('keydown', function () {
                $range1.value = $value1.value;
                setupPosterize($value1.value, $range2.value);
            });

            $range2.addEventListener('change', function () {
                $value2.value = $range2.value;
                setupPosterize($range1.value, $range2.value);
            });

            $value2.addEventListener('keydown', function () {
                $range2.value = $value2.value;
                setupPosterize($range1.value, $value1.value);
            });

            $value1.value = $range1.value = StretchTool.DEFAULT_MIN;
            $value2.value = $range2.value = StretchTool.DEFAULT_MAX;
            setupPosterize(StretchTool.DEFAULT_MIN, StretchTool.DEFAULT_MAX);
        }, 0);
    };

    StretchTool.DEFAULT_MIN = 0;
    StretchTool.DEFAULT_MAX = 255;

    // Exports `StretchTool`.
    return (root.StretchTool = StretchTool);

}(this));
