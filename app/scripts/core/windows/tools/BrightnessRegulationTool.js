(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var BrightnessRegulationTool = function BrightnessRegulationTool(params) {
        // console.info('new BrightnessRegulationTool', params);

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

    BrightnessRegulationTool.prototype = new AbstractWindow();

    BrightnessRegulationTool.prototype.initialize = function () {
        this.$window.classList.add('brightness-regulation-tool');

        // Update title of window.
        this.updateTitle('Regulacja jasnością - ' +  this.settings.picture.name);

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
        var template = doc.querySelector('#template-brightness-regulation-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range = self.$content.querySelector('.brightness-regulation-tool-regulation-range');
            var $value = self.$content.querySelector('.brightness-regulation-tool-regulation-value');

            function setupBrightnessRegulation(level) {
                // Restore image to origin.
                self.settings.picture.canvas.loadGrayScaleImage(self.settings.picture.img, self.settings.picture.width, self.settings.picture.height);

                // Apply brightness-regulation to image.
                root.OperationOnePoint.onePointBrightnessRegulation({
                    workspace: self.settings.picture.canvas,
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

            // Set focus on main dynamic element.
            $range.focus();
        }, 0);
    };

    BrightnessRegulationTool.DEFAULT_LEVEL = 0;

    // Exports `BrightnessRegulationTool`.
    return (root.BrightnessRegulationTool = BrightnessRegulationTool);

}(this));
