(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var SharpenTool = function SharpenTool(params) {
        // console.info('new SharpenTool', params);

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

    SharpenTool.prototype = new AbstractWindow();

    SharpenTool.prototype.initialize = function () {
        this.$window.classList.add('sharpen-tool');

        // Update title of window.
        this.updateTitle(root.locale.get('OPERATIONS_NEIGHBOURHOOD_SHARPEN') + ' - ' +  this.settings.picture.name);

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

    SharpenTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-sharpen-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $horizontalText = self.$content.querySelector('.sharpen-tool-horizontal-text');
            var $horizontalRange = self.$content.querySelector('.sharpen-tool-horizontal-range');
            var $verticalText = self.$content.querySelector('.sharpen-tool-vertical-text');
            var $verticalRange = self.$content.querySelector('.sharpen-tool-vertical-range');

            var canvas = new root.Canvas({
                width: self.settings.picture.canvas.$canvas.width,
                height: self.settings.picture.canvas.$canvas.height
            });

            canvas.markAsNotActive();
            canvas.render(self);

            function update() {
                root.OperationsNeighbourhood.sharpen({
                    picture: self.settings.picture,
                    workspace: canvas,
                    dims: {
                        x: $horizontalText.value,
                        y: $verticalText.value
                    }
                });
            }

            $horizontalRange.addEventListener('change', function () {
                $horizontalText.value = $horizontalRange.value;
                update();
            });

            $verticalRange.addEventListener('change', function () {
                $verticalText.value = $verticalRange.value;
                update();
            });

            // Set defaults options.
            $horizontalRange.value = $horizontalText.value = SharpenTool.DEFAULT_HORIZONTAL;
            $verticalRange.value = $verticalText.value = SharpenTool.DEFAULT_VERTICAL;

            update();
        }, 0);
    };

    SharpenTool.DEFAULT_HORIZONTAL = 3;
    SharpenTool.DEFAULT_VERTICAL = 3;

    // Exports `SharpenTool`.
    return (root.SharpenTool = SharpenTool);

}(this));
