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

        this.setup();
        this.initialize();
    };

    MorphologicalTool.prototype = new root.AbstractWindow();

    MorphologicalTool.prototype.initialize = function () {
        this.$window.classList.add('morphological-tool');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI(function () {
                // Set static width.
                this.setRigidWidth();

                // Update title of window.
                this.updateTitle(root.Locale.get('OPERATIONS_MORPHOLOGICAL'));

                // Append window list.
                root.App.windowManager.addWindow(this);

                this.emit(root.AbstractWindow.EVENTS.READY);
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
            var $figure = self.$content.querySelectorAll('fieldset:nth-child(1) input[type="radio"]');
            var $type = self.$content.querySelectorAll('fieldset:nth-child(2) button');
            var $reset = self.$content.querySelector('.morphological-tool-reset');

            function getSelectedFigure() {
                var figure = _.findWhere($figure, { checked: true });
                return figure ? figure.value : null;
            }

            function callMorphologicalAction(evt) {
                var type = evt.target.dataset.type;

                if (!type) {
                    return;
                }

                new root.Operation(function () {
                    var figure = getSelectedFigure();

                    if (!figure) {
                        return;
                    }

                    root.OperationsMorphological[type](self.contextWindow, {
                        figure: figure
                    });
                });
            }

            function resetPicture() {
                self.contextWindow.setPrimaryState();
            }

            _.invoke($type, 'addEventListener', 'click', callMorphologicalAction);
            $reset.addEventListener('click', resetPicture);

            if (_.isFunction(cb)) {
                cb.call(self);
            }
        }, 0);
    };

    // Exports `MorphologicalTool`.
    return (root.MorphologicalTool = MorphologicalTool);

}(this));
