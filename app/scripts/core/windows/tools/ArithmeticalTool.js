(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ArithmeticalTool = function ArithmeticalTool(contextWindow, params) {
        // console.info('new ArithmeticalTool', params);

        this.contextWindow = contextWindow;
        this.settings = {
            pictures: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;
        this.isActive = false;

        this.setup(contextWindow);
        this.initialize();
    };

    ArithmeticalTool.prototype = new AbstractWindow();

    ArithmeticalTool.prototype.initialize = function () {
        this.$window.classList.add('arithmetical-tool');

        // Update title of window.
        this.updateTitle(root.Locale.get('OPERATIONS_ONE_POINT_ARITHMETIC'));

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

    ArithmeticalTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-arithmetical-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $select = self.$content.querySelector('select');
            var $options = $select.querySelectorAll('option');

            var canvas = new root.Canvas({
                width: self.settings.pictures[0].canvas.$canvas.width,
                height: self.settings.pictures[0].canvas.$canvas.height
            });

            canvas.markAsNotActive();
            canvas.render(self);

            $select.addEventListener('change', function (evt) {
                var $selected = $options[evt.target.selectedIndex];

                // If select default option do nothing.
                if (!$selected.value) {
                    return;
                }

                canvas.clear();

                root.OperationsOnePoint.onePointArithmetical(self.contextWindow, {
                    pictures: self.settings.pictures,
                    workspace: canvas,
                    operation: $selected.value
                });
            });
        }, 0);
    };

    // Exports `ArithmeticalTool`.
    return (root.ArithmeticalTool = ArithmeticalTool);

}(this));
