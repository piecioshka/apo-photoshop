(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var SmoothingTool = function SmoothingTool(params) {
        // console.info('new SmoothingTool', params);

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

    SmoothingTool.prototype = new AbstractWindow();

    SmoothingTool.prototype.initialize = function () {
        this.$window.classList.add('smoothing-tool');

        // Update title of window.
        this.updateTitle(root.locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING') + ' - ' +  this.settings.picture.name);

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

    SmoothingTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-smoothing-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $fdRadios = self.$content.querySelector('.fd-masks').querySelectorAll('input[type="radio"]');
            var $fgRadios = self.$content.querySelector('.fg-masks').querySelectorAll('input[type="radio"]');
            var $preview = self.$content.querySelector('.smoothing-tool-preview');
            var $textes = $preview.querySelectorAll('input[type="text"]');
            var $submit = $preview.querySelector('input[type="submit"]');

            function disable(status) {
                _.each($textes, function ($text) {
                    $text.disabled = !!status;
                    $text.classList[status ? 'add' : 'remove']('disabled');
                });
                $submit.disabled = !!status;
                $submit.classList[status ? 'add' : 'remove']('disabled');
            }

            function put(mask) {
                _.each($textes, function ($text, index) {
                    $text.value = mask[index];
                });
            }

            var canvas = new root.Canvas({
                width: self.settings.picture.canvas.$canvas.width,
                height: self.settings.picture.canvas.$canvas.height
            });

            canvas.markAsNotActive();
            canvas.render(self);

            function handleChosenMask(evt, listOfMasks) {
                canvas.clear();

                var v = evt.target.value;
                var id = v.replace(/[^0-9]/g, '');
                var isMask = (/-/).test(v);
                var mask = listOfMasks[id];

                // If we choose any mask, disable inputs.
                if (isMask) {
                    disable(true);
                    put(mask);

                    root.OperationsNeighbourhood.smoothing({
                        picture: self.settings.picture,
                        workspace: canvas,
                        mask: mask
                    });
                } else {
                    disable(false);
                }
            }

            function handleCustomMask() {
                var mask = [];

                _.each($textes, function ($text) {
                    mask.push(parseInt($text.value, 10));
                });

                root.OperationsNeighbourhood.smoothing({
                    picture: self.settings.picture,
                    workspace: canvas,
                    mask: mask
                });
            }

            _.each($fdRadios, function ($radio) {
                $radio.addEventListener('change', function (evt) {
                    handleChosenMask(evt, SmoothingTool.MASK_FD);
                });
            });

            _.each($fgRadios, function ($radio) {
                $radio.addEventListener('change', function (evt) {
                    handleChosenMask(evt, SmoothingTool.MASK_FG);
                });
            });

            $submit.addEventListener('click', function () {
                handleCustomMask();
            });
        }, 0);
    };

    SmoothingTool.MASK_FD = [
        [1, 1, 1,
         1, 1, 1,
         1, 1, 1],

        [1, 1, 1,
         1, 2, 1,
         1, 1, 1],

        [1, 2, 1,
         2, 4, 2,
         1, 2, 1],

        [1, 1, 1,
         1, 0, 1,
         1, 1, 1]
    ];

    SmoothingTool.MASK_FG = [
        [-1, -2, -1,
          0,  0,  0,
          1,  2,  1],

        [ 1, -2,  1,
         -2,  5, -2,
          1, -2,  1],

        [-1, -1, -1,
         -1,  9, -1,
         -1, -1, -1],

        [ 0, -1,  0,
         -1,  5, -1,
          0, -1,  0]
    ];

    // Exports `SmoothingTool`.
    return (root.SmoothingTool = SmoothingTool);

}(this));
