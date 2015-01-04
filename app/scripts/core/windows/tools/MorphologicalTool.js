(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var MorphologicalTool = function MorphologicalTool(contextWindow, params) {
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

        this.setup(contextWindow);
        this.initialize();
    };

    MorphologicalTool.prototype = new root.AbstractWindow();

    MorphologicalTool.prototype.initialize = function () {
        this.$window.classList.add('morphological-tool');

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI(function () {
                // Set static width.
                this.setRigidWidth();

                // Update title of window.
                this.updateTitle(root.Locale.get('OPERATIONS_MORPHOLOGICAL'));
            });
        });

        // Render window.
        this.render();
    };

    MorphologicalTool.prototype.buildUI = function (cb) {
        var self = this;
        var template = doc.querySelector('#template-morphological-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $type = self.$content.querySelectorAll('fieldset:nth-child(1) input[type="radio"]');
            var $figure = self.$content.querySelectorAll('fieldset:nth-child(2) input[type="radio"]');

            function getSelectedType() {
                var type = _.findWhere($type, { checked: true });
                return type ? type.value : null;
            }

            function getSelectedFigure() {
                var figure = _.findWhere($figure, { checked: true });
                return figure ? figure.value : null;
            }

            function callMorphologicalAction() {
                new root.Operation(function () {
                    var type = getSelectedType();
                    var figure = getSelectedFigure();

                    if (!type || !figure) {
                        return;
                    }

                    self.contextWindow.setPrimaryState();

                    root.OperationsMorphological[type](self.contextWindow, {
                        figure: figure
                    });
                });
            }

            _.invoke($type, 'addEventListener', 'click', callMorphologicalAction);
            _.invoke($figure, 'addEventListener', 'click', callMorphologicalAction);

            if (_.isFunction(cb)) {
                cb.call(self);
            }
        }, 0);
    };

    // Exports `MorphologicalTool`.
    return (root.MorphologicalTool = MorphologicalTool);

}(this));
