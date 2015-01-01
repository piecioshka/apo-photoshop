(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ColorPaletteWindow = function ColorPaletteWindow() {
        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;
        this.isActive = false;

        this._selectedColor = undefined;

        this.setup();
        this.initialize();
    };

    ColorPaletteWindow.prototype = new root.AbstractWindow();

    ColorPaletteWindow.prototype.initialize = function () {
        this.$window.classList.add('color-palette-window');

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI();

            // Update title of window.
            this.updateTitle(root.Locale.get('TOOLS_COLOR_PALETTE'));
        });

        // Render window.
        this.render();
    };

    ColorPaletteWindow.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-color-palette-special').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        function getMousePos($canvas, evt) {
            var rect = $canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        new Operation(function buildHSVPalette() {
            var $select = self.$content.querySelector('.color-palette-chooser select');
            var $r = self.$content.querySelector('.color-palette-r');
            var $g = self.$content.querySelector('.color-palette-g');
            var $b = self.$content.querySelector('.color-palette-b');
            var $a = self.$content.querySelector('.color-palette-a');
            var $ch = self.$content.querySelector('.color-palette-ch');
            var $cs = self.$content.querySelector('.color-palette-cs');

            var paletteWidth = 200;
            var paletteHeight = 200;

            var canvas = new root.Canvas({
                width: paletteWidth,
                height: paletteHeight
            });

            function loadPalette(url) {
                var img = new Image();
                img.src = url;
                img.onload = function () {
                    canvas.clear();
                    canvas.ctx.drawImage(img, 0, 0, paletteWidth, paletteHeight);
                };
            }

            loadPalette('images/palette/colorwheel1.png');

            canvas.$canvas.addEventListener('mousemove', function (evt) {
                var mousePos = getMousePos(canvas.$canvas, evt);
                var imageData = canvas.ctx.getImageData(mousePos.x, mousePos.y, 1, 1);
                var data = imageData.data;
                $ch.style.background = 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + data[3] + ')';

                // Put channels into inputs.
                $r.value = data[0];
                $g.value = data[1];
                $b.value = data[2];
                $a.value = data[3];
            }, false);

            canvas.$canvas.addEventListener('click', function (evt) {
                var mousePos = getMousePos(canvas.$canvas, evt);
                var imageData = canvas.ctx.getImageData(mousePos.x, mousePos.y, 1, 1);
                var data = self._selectedColor = imageData.data;
                $cs.style.background = 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + data[3] + ')';
            });

            canvas.render(self);

            $select.addEventListener('change', function () {
                loadPalette('images/palette/' + $select.value);
            });
        });
    };

    ColorPaletteWindow.prototype.getSelectedColor = function () {
        return this._selectedColor;
    };

    // Exports `ColorPaletteWindow`.
    return (root.ColorPaletteWindow = ColorPaletteWindow);

}(this));
