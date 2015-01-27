(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ChooseColorTurtleAlgorithmTool = function ChooseColorTurtleAlgorithmTool(contextWindow, params) {
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

    ChooseColorTurtleAlgorithmTool.prototype = new root.AbstractWindow();

    ChooseColorTurtleAlgorithmTool.prototype.initialize = function () {
        this.$window.classList.add('choose-color-turtle-algorithm-tool');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI(function () {
                // Set static width.
                this.setRigidWidth();

                // Update title (add each file name).
                this.updateTitle(root.Locale.get('OPERATIONS_TURTLE') + ' - ' + this.settings.picture.name);

                // Append window list.
                root.App.windowManager.addWindow(this);

                this.emit(root.AbstractWindow.EVENTS.READY);
            });
        });

        // Render window.
        this.render();
    };

    ChooseColorTurtleAlgorithmTool.prototype.buildUI = function (cb) {
        var self = this;
        var template = doc.querySelector('#template-choose-color-turtle-algorithm-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $i = self.$content.querySelector('i');
            var $apply = self.$content.querySelector('.choose-color-turtle-algorithm-tool-apply');
            var selectedColor = [255, 0, 0, 255];

            $i.addEventListener('click', function () {
                var palette = new root.ColorPaletteWindow();

                palette.on(root.ColorPaletteWindow.EVENTS.SELECT_COLOR, function () {
                    var c = palette.getSelectedColor();
                    selectedColor = [c[0], c[1], c[2], c[3]];

                    if (!_.isEmpty(c)) {
                        $i.style.background = 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + c[3] + ')';
                    }
                });
            });

            $apply.addEventListener('click', function () {
                new root.Operation(function () {
                    root.TurtleAlgorithm(self.contextWindow, {
                        markColor: selectedColor
                    });
                });
            });

            // Set to black.
            $i.style.background = 'rgba(255, 0, 0, 255)';

            if (_.isFunction(cb)) {
                cb.call(self);
            }
        }, 0);
    };

    // Exports `ChooseColorTurtleAlgorithmTool`.
    return (root.ChooseColorTurtleAlgorithmTool = ChooseColorTurtleAlgorithmTool);

}(this));
