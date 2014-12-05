(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var BrightnessRegulationTool = function BrightnessRegulationTool(params) {
        // console.info('new BrightnessRegulationTool', params);

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

    BrightnessRegulationTool.prototype = new AbstractWindow();

    BrightnessRegulationTool.prototype.initialize = function () {
        this.$window.classList.add('brightness-regulation-tool');

        // Update title of window.
        this.updateTitle('Regulacja jasnością - ' +  this.settings.image.name);

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

    BrightnessRegulationTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#brightness-regulation-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range = doc.querySelector('#brightness-regulation-tool-regulation-range');
            var $value = doc.querySelector('#brightness-regulation-tool-regulation-value');

            function setupBrightnessRegulation(level) {
                // Restore image to origin.
                self.settings.canvas.loadGrayScaleImage(self.settings.image.image, self.settings.image.width, self.settings.image.height);

                // Apply brightness-regulation to image.
                root.OperationOnePoint.onePointBrightnessRegulation({
                    workspace: self.settings.canvas,
                    value: level
                });
            }

            $range.addEventListener('change', function () {
                $value.value = $range.value;
                setupBrightnessRegulation($range.value);
            });

            $value.addEventListener('keydown', function () {
                $range.value = $value.value;
                setupBrightnessRegulation($range.value);
            });

            $value.value = $range.value = BrightnessRegulationTool.DEFAULT_LEVEL;
            setupBrightnessRegulation(BrightnessRegulationTool.DEFAULT_LEVEL);
        }, 0);
    };

    BrightnessRegulationTool.DEFAULT_LEVEL = 0;

    // Exports `BrightnessRegulationTool`.
    return (root.BrightnessRegulationTool = BrightnessRegulationTool);

}(this));