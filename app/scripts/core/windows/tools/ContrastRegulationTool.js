(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ContrastRegulationTool = function ContrastRegulationTool(contextWindow, params) {
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

    ContrastRegulationTool.prototype = new root.AbstractWindow();

    ContrastRegulationTool.prototype.initialize = function () {
        this.$window.classList.add('contrast-regulation-tool');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI();

            // Update title of window.
            this.updateTitle(root.Locale.get('OPERATIONS_ONE_POINT_CONTRAST_REGULATION') + ' - ' +  this.settings.picture.name);

            // Append window list.
            root.App.windowManager.addWindow(this);

            this.emit(root.AbstractWindow.EVENTS.READY);
        });

        // Render window.
        this.render();
    };

    ContrastRegulationTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-contrast-regulation-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $range = self.$content.querySelector('.contrast-regulation-tool-regulation-range');
            var $value = self.$content.querySelector('.contrast-regulation-tool-regulation-value');

            root.InputRangeHelper.bindKeyShortcuts($range);

            function setupContrastRegulation(level) {
                new root.Operation(function () {
                    // Restore image to origin.
                    self.contextWindow.setPrimaryState();

                    // Apply contrast-regulation to image.
                    root.OperationsOnePoint.onePointContrastRegulation(self.contextWindow, {
                        value: level
                    });
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

            // Set focus on main dynamic element.
            $range.focus();
        }, 0);
    };

    ContrastRegulationTool.DEFAULT_LEVEL = 0;

    // Exports `ContrastRegulationTool`.
    return (root.ContrastRegulationTool = ContrastRegulationTool);

}(this));
