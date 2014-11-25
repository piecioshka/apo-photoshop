(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var GammaRegulationTool = function GammaRegulationTool(params) {
        console.info('new GammaRegulationTool', params);

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

    GammaRegulationTool.prototype = new AbstractWindow();

    GammaRegulationTool.prototype.initialize = function () {
        this.$window.classList.add('gamma-regulation-tool');

        // Update title of window.
        this.updateTitle('Regulacja korekcją gamma - ' +  this.settings.image.name);

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

    GammaRegulationTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#gamma-regulation-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.setContent(renderedTemplate);

        setTimeout(function () {
            var $range = doc.querySelector('#gamma-regulation-tool-regulation-range');
            var $value = doc.querySelector('#gamma-regulation-tool-regulation-value');

            function setupContrastRegulation(level) {
                // Restore image to origin.
                self.settings.canvas.loadGrayScaleImage(self.settings.image.image, self.settings.image.width, self.settings.image.height);

                // Apply gamma-regulation to image.
                root.OperationOnePoint.onePointGammaRegulation({
                    workspace: self.settings.canvas,
                    value: level
                });
            }

            $range.addEventListener('change', function () {
                $value.value = $range.value;
                setupContrastRegulation($range.value);
            });

            $value.addEventListener('keydown', function () {
                $range.value = $value.value;
                setupContrastRegulation($range.value);
            });

            $value.value = $range.value = GammaRegulationTool.DEFAULT_LEVEL;
            setupContrastRegulation(GammaRegulationTool.DEFAULT_LEVEL);
        }, 0);
    };

    GammaRegulationTool.DEFAULT_LEVEL = 1;

    // Exports `GammaRegulationTool`.
    return (root.GammaRegulationTool = GammaRegulationTool);

}(this));
