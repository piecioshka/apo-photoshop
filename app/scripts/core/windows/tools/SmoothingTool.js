(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var SmoothingTool = function SmoothingTool(contextWindow, params) {
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

    SmoothingTool.prototype = new root.AbstractWindow();

    SmoothingTool.prototype.initialize = function () {
        this.$window.classList.add('smoothing-tool');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI(function () {
                // Set static width.
                this.setRigidWidth();

                // Update title of window.
                this.updateTitle(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_SMOOTHING') + ' - ' +  this.settings.picture.name);

                // Append window list.
                root.App.windowManager.addWindow(this);

                this.emit(root.AbstractWindow.EVENTS.READY);
            });
        });

        // Render window.
        this.render();
    };

    SmoothingTool.prototype.buildUI = function (cb) {
        var self = this;
        var template = doc.querySelector('#template-smoothing-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $select = self.$content.querySelector('.smoothing-tool-options select');
            var $preview = self.$content.querySelector('.smoothing-tool-preview');
            var $scaleArea = self.$content.querySelector('.smoothing-tool-scale');
            var $scale = $scaleArea.querySelectorAll('input[type="radio"]');

            var $divisor = $preview.querySelector('.smoothing-tool-preview-divisor');
            var $textes = $preview.querySelectorAll('fieldset input[type="text"]');
            var $submit = $preview.querySelector('input[type="submit"]');

            function disableInputText(status) {
                _.each($textes, function ($text) {
                    $text.disabled = !!status;
                });

                $submit.disabled = !!status;
            }

            function disableInputRadio(status) {
                _.each($scale, function ($s) {
                    $s.disabled = !!status;
                });
            }

            function put(mask) {
                _.each($textes, function ($text, index) {
                    $text.value = mask[index];
                });

                $divisor.value = root.Utilities.sum(mask) || 1;
            }

            function fetch() {
                var mask = [];

                _.each($textes, function ($text) {
                    mask.push(parseInt($text.value, 10));
                });

                return mask;
            }

            function getScale() {
                return _.findWhere($scale, { checked: true }).value;
            }

            function handleChosenMask() {
                new root.Operation(function () {
                    var type, mask, scale;
                    var v = $select.value;

                    self.contextWindow.setPrimaryState();

                    if (v !== '-') {
                        type = v.replace(/[0-9\-]/g, '');
                        mask = SmoothingTool['MASK_' + type.toUpperCase()][v.replace(/[^0-9]/g, '')];
                        scale = getScale();

                        disableInputRadio(type !== 'fg');
                        disableInputText(true);
                        put(mask);

                        root.OperationsNeighbourhood.smoothing(self.contextWindow, {
                            mask: mask,
                            scale: scale,
                            type: type
                        });
                    } else {
                        disableInputRadio(true);
                        disableInputText(false);
                    }
                });
            }

            function handleCustomMask() {
                new root.Operation(function () {
                    // Set default value as '0'.
                    _.each($textes, function ($text) {
                        $text.value = $text.value || 0;
                    });

                    var mask = fetch();
                    var scale = getScale();

                    $divisor.value = root.Utilities.sum(mask) || 1;

                    self.contextWindow.setPrimaryState();

                    root.OperationsNeighbourhood.smoothing(self.contextWindow, {
                        mask: mask,
                        scale: scale,
                        type: -1
                    });
                });
            }

            $select.addEventListener('change', handleChosenMask);
            _.invoke($scale, 'addEventListener', 'click', handleChosenMask);
            $submit.addEventListener('click', handleCustomMask);

            // Default is 'Maska własna' so disable scale methods.
            disableInputRadio(true);

            if (_.isFunction(cb)) {
                cb.call(self);
            }
        }, 0);
    };

    SmoothingTool.MASK_FD = [
        // Wygładzanie
        [ 1,  1,  1,  1,  0,  1,  1,  1,  1],
        [ 1,  1,  1,  1,  1,  1,  1,  1,  1],
        [ 1,  1,  1,  1,  2,  1,  1,  1,  1],
        [ 1,  2,  1,  2,  4,  2,  1,  2,  1]
    ];

    SmoothingTool.MASK_FG = [
        // Wyostrzanie
        [-1, -2, -1,  0,  0,  0,  1,  2,  1],
        [ 1, -2,  1, -2,  5, -2,  1, -2,  1],
        [-1, -1, -1, -1,  9, -1, -1, -1, -1],
        [ 0, -1,  0, -1,  5, -1,  0, -1,  0],
        [-2,  1, -2,  1,  5,  1, -2,  1, -2]
    ];

    SmoothingTool.MASK_DK = [
        // Detekcja krawędzi
        [ 0,  1,  0,  1, -4,  1,  0,  1,  0],
        [-1, -1, -1, -1,  8, -1, -1, -1, -1],
        [ 1, -2,  1, -2,  4, -2,  1, -2,  1]
    ];

    // Exports `SmoothingTool`.
    return (root.SmoothingTool = SmoothingTool);

}(this));
