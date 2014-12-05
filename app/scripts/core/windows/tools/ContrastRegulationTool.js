(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ContrastRegulationTool = function ContrastRegulationTool(params) {
        // console.info('new ContrastRegulationTool', params);

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

    ContrastRegulationTool.prototype = new AbstractWindow();

    ContrastRegulationTool.prototype.initialize = function () {
        this.$window.classList.add('contrast-regulation-tool');

        // Update title of window.
        this.updateTitle('Regulacja kontrastem - ' +  this.settings.image.name);

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

    ContrastRegulationTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#contrast-regulation-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range = doc.querySelector('#contrast-regulation-tool-regulation-range');
            var $value = doc.querySelector('#contrast-regulation-tool-regulation-value');

            function setupContrastRegulation(level) {
                // Restore image to origin.
                self.settings.canvas.loadGrayScaleImage(self.settings.image.image, self.settings.image.width, self.settings.image.height);

                // Apply contrast-regulation to image.
                root.OperationOnePoint.onePointContrastRegulation({
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

            $value.value = $range.value = ContrastRegulationTool.DEFAULT_LEVEL;
            setupContrastRegulation(ContrastRegulationTool.DEFAULT_LEVEL);
        }, 0);
    };

    ContrastRegulationTool.DEFAULT_LEVEL = 0;

    // Exports `ContrastRegulationTool`.
    return (root.ContrastRegulationTool = ContrastRegulationTool);

}(this));
