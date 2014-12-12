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
            var $select = self.$content.querySelector('.sharpen-tool-options select');
            var $options = $select.querySelectorAll('option');

            var canvas = new root.Canvas({
                width: self.settings.picture.canvas.$canvas.width,
                height: self.settings.picture.canvas.$canvas.height
            });

            canvas.markAsNotActive();
            canvas.render(self);

            $select.addEventListener('change', function (evt) {
                var $selected = $options[evt.target.selectedIndex];

                // If select default option do nothing.
                if (!$selected.value) {
                    return;
                }

                root.OperationsNeighbourhood.sharpen({
                    picture: self.settings.picture,
                    workspace: canvas,
                    type: $selected.value
                });
            });
        }, 0);
    };

    // Exports `SharpenTool`.
    return (root.SharpenTool = SharpenTool);

}(this));
