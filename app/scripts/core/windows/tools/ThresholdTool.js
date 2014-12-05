(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ThresholdTool = function ThresholdTool(params) {
        // console.info('new ThresholdTool', params);

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

    ThresholdTool.prototype = new AbstractWindow();

    ThresholdTool.prototype.initialize = function () {
        this.$window.classList.add('threshold-tool');

        // Update title of window.
        this.updateTitle('Progowanie - ' +  this.settings.image.name);

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

    ThresholdTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-threshold-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range = self.$content.querySelector('.threshold-tool-regulation-range');
            var $value = self.$content.querySelector('.threshold-tool-regulation-value');

            function setupThreshold(hold) {
                // Restore image to origin.
                self.settings.canvas.loadGrayScaleImage(self.settings.image.image, self.settings.image.width, self.settings.image.height);

                // Apply threshold to image.
                root.OperationOnePoint.onePointThreshold({
                    workspace: self.settings.canvas,
                    value: hold
                });
            }

            $range.addEventListener('change', function () {
                $value.value = $range.value;
                setupThreshold($range.value);
            });

            $value.addEventListener('keydown', function () {
                $range.value = $value.value;
                setupThreshold($range.value);
            });

            $value.value = $range.value = ThresholdTool.DEFAULT_HOLDER;
            setupThreshold(ThresholdTool.DEFAULT_HOLDER);
        }, 0);
    };

    ThresholdTool.DEFAULT_HOLDER = 128;

    // Exports `ThresholdTool`.
    return (root.ThresholdTool = ThresholdTool);

}(this));
