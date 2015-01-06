(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ArithmeticalLogicalTool = function ArithmeticalLogicalTool() {
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

    ArithmeticalLogicalTool.prototype = new root.AbstractWindow();

    ArithmeticalLogicalTool.prototype.initialize = function () {
        this.$window.classList.add('arithmetical-logical-tool');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI(function () {
                // Set static width.
                this.setRigidWidth();

                // Update title of window.
                this.updateTitle(root.Locale.get('OPERATIONS_ONE_POINT_ARITHMETICAL_LOGICAL'));

                // Append window list.
                root.App.windowManager.addWindow(this);

                this.emit(root.AbstractWindow.EVENTS.READY);
            });
        });

        // Render window.
        this.render();
    };

    ArithmeticalLogicalTool.prototype.buildUI = function (cb) {
        var self = this;
        var resultWindow = null;
        var wm = root.App.windowManager;
        var template = doc.querySelector('#template-arithmetical-logical-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {
            var $selectOperation = self.$content.querySelector('select.arithmetical-logical-tool-operations');
            var $selectFirst = self.$content.querySelector('select.arithmetical-logical-tool-first');
            var $selectSecond = self.$content.querySelector('select.arithmetical-logical-tool-second');

            function buildOption(val, text) {
                var opt = doc.createElement('option');
                opt.setAttribute('value', val);
                opt.innerText = text;
                return opt;
            }

            function buildWindowSelects() {
                var picturesWindows = wm.getOnlyPictureWindows();

                $selectFirst.innerHTML = $selectSecond.innerHTML = '';

                $selectFirst.appendChild(buildOption('', '---'));
                $selectSecond.appendChild(buildOption('', '---'));

                _.each(picturesWindows, function (win) {
                    $selectFirst.appendChild(buildOption(win.id, win.getTitle()));
                    $selectSecond.appendChild(buildOption(win.id, win.getTitle()));
                });
            }

            function getFirstSelect() {
                return $selectFirst.value;
            }

            function getSecondSelect() {
                return $selectSecond.value;
            }

            function getOperationSelect() {
                return $selectOperation.value;
            }

            buildWindowSelects();

            var canvas = new root.Canvas();
            canvas.$canvas.classList.add('canvas-picture');

            $selectFirst.addEventListener('change', function () {
                $selectOperation.children[0].selected = 'selected';
                $selectOperation.disabled = (getFirstSelect() && getSecondSelect()) ? '' : 'disabled';
            });

            $selectSecond.addEventListener('change', function () {
                $selectOperation.children[0].selected = 'selected';
                $selectOperation.disabled = (getFirstSelect() && getSecondSelect()) ? '' : 'disabled';
            });

            $selectOperation.addEventListener('change', function () {
                // Check, than every <select> will be choose.
                if (getOperationSelect() === '---' || !getFirstSelect() || !getSecondSelect()) {
                    return;
                }

                var firstWindow = wm.getWindowsById(getFirstSelect());
                var secondWindow = wm.getWindowsById(getSecondSelect());

                // Maybe windows, are close yet.
                if (!firstWindow || !secondWindow) {
                    return;
                }

                var firstPicture = firstWindow.settings.picture;
                var secondPicture = secondWindow.settings.picture;

                var newWidth = Math.max(firstPicture.width, secondPicture.width);
                var newHeight = Math.max(firstPicture.height, secondPicture.height);

                canvas.setWidth(newWidth);
                canvas.setHeight(newHeight);

                function runOperation() {
                    new root.Operation(function () {
                        root.OperationsOnePoint.onePointArithmeticalLogical(resultWindow, {
                            operation: getOperationSelect(),
                            firstPicture: firstPicture,
                            secondPicture: secondPicture
                        });
                    });
                }

                if (!resultWindow) {
                    resultWindow = new root.PictureWindow({
                        picture: {
                            width: newWidth,
                            height: newHeight,
                            canvas: canvas,
                            img: canvas.toImage(),
                            name: root.Locale.get('MSG_UNKNOWN')
                        }
                    });

                    resultWindow.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, runOperation);
                    resultWindow.on(root.AbstractWindow.EVENTS.CLOSE_WINDOW, function () {
                        resultWindow = null;
                    });
                } else {
                    runOperation();
                }
            });

            if (_.isFunction(cb)) {
                cb.call(self);
            }
        }, 0);
    };

    // Exports `ArithmeticalLogicalTool`.
    return (root.ArithmeticalLogicalTool = ArithmeticalLogicalTool);

}(this));
