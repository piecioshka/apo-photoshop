(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var UOPWindow = function UOPWindow(contextWindow, params) {
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

    UOPWindow.prototype = new root.AbstractWindow();

    UOPWindow.prototype.initialize = function () {
        this.$window.classList.add('uop-window');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildTable();

            // Update title of window.
            this.updateTitle(root.Locale.get('TOOLS_UOP') + ' - ' + this.settings.picture.name);

            // Append window list.
            root.App.windowManager.addWindow(this);

            this.emit(root.AbstractWindow.EVENTS.READY);
        });

        // Render window.
        this.render();
    };

    UOPWindow.prototype.buildTable = function () {
        var self = this;
        var pixels = this.settings.picture.canvas.getCountingColorList();

        _.each(pixels, function (item, index) {
            if (pixels[index] === 0) {
                delete pixels[index];
            }
        });

        var template = doc.querySelector('#template-uop-static').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled({
            pixels: pixels
        });

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $inputs = self.$content.querySelectorAll('input[type="number"]');

            function getColors() {
                return _.map($inputs, function ($input) {
                    return parseInt($input.value, 10);
                });
            }

            _.each($inputs, function ($input) {
                $input.addEventListener('change', function () {
                    new root.Operation(function () {
                        var color = $input.value;
                        var negativeColor = 255 - $input.value;
                        var colors = getColors();

                        root.OperationsOnePoint.onePointUOP(self.contextWindow, {
                            colors: colors,
                            copy: self.settings.picture
                        });

                        // Update color of changed table cell.
                        $input.parentNode.style.background = 'rgb(' + color + ', ' + color + ', ' + color + ')';
                        $input.parentNode.style.color = 'rgb(' + negativeColor + ', ' + negativeColor + ', ' + negativeColor + ')';
                    });
                });
            });
        }, 0);
    };

    // Exports `UOPWindow`.
    return (root.UOPWindow = UOPWindow);

}(this));
