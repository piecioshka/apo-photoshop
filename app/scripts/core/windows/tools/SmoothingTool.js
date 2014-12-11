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
            var $radios = self.$content.querySelectorAll('input[type="radio"]');
            var $preview = self.$content.querySelector('.smoothing-tool-preview');

            var canvas = new root.Canvas({
                width: self.settings.picture.canvas.$canvas.width,
                height: self.settings.picture.canvas.$canvas.height
            });

            canvas.markAsNotActive();
            canvas.render(self);

            function handleChange(evt) {
                canvas.clear();

                var v = evt.target.value;
                var isMask = (/-/).test(v);

                root.OperationsNeighbourhood.smoothing({
                    pictures: self.settings.pictures,
                    workspace: canvas,
                    mask: []
                });
            }

            _.each($radios, function ($radio) {
                $radio.addEventListener('change', handleChange);
            });
        }, 0);
    };

    SmoothingTool.MASK_FD = [
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ],
        [
            [1, 1, 1],
            [1, 2, 1],
            [1, 1, 1]
        ],
        [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ],
        [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1]
        ]
    ];

    SmoothingTool.MASK_FG = [
        [
            [-1, -2, -1],
            [ 0,  0,  0],
            [ 1,  2,  1]
        ],
        [
            [ 1, -2,  1],
            [-2,  5, -2],
            [ 1, -2,  1]
        ],
        [
            [-1, -1, -1],
            [-1,  9, -1],
            [-1, -1, -1]
        ],
        [
            [ 0, -1,  0],
            [-1,  5, -1],
            [ 0, -1,  0]
        ]
    ];

    // Exports `SmoothingTool`.
    return (root.SmoothingTool = SmoothingTool);

}(this));
