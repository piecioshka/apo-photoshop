(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var LogicalTool = function LogicalTool() {
        // console.info('new LogicalTool');

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

    LogicalTool.prototype = new AbstractWindow();

    LogicalTool.prototype.initialize = function () {
        this.$window.classList.add('logical-tool');

        // Update title of window.
        this.updateTitle(root.Locale.get('OPERATIONS_ONE_POINT_LOGICAL'));

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

    LogicalTool.prototype.buildUI = function () {
        var self = this;
        var wm = root.App.windowManager;
        var template = doc.querySelector('#template-logical-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        requestAnimationFrame(function () {
            var $selectFirst = self.$content.querySelector('select.logical-tool-first');
            var $selectSecond = self.$content.querySelector('select.logical-tool-second');
            var $selectOperation = self.$content.querySelector('select.logical-tool-operations');

            function buildOption(val, text) {
                var opt = doc.createElement('option');
                opt.value = val;
                opt.innerText = text;
                return opt;
            }

            function buildWindowSelects() {
                var picturesWindows = wm.getPictureWindows();

                $selectFirst.innerHTML = $selectSecond.innerHTML = '';

                $selectFirst.appendChild(buildOption('', '---'));
                $selectSecond.appendChild(buildOption('', '---'));

                _.each(picturesWindows, function (win) {
                    $selectFirst.appendChild(buildOption(win.id, win.getTitle()));
                    $selectSecond.appendChild(buildOption(win.id, win.getTitle()));
                });
            }

            function getFirstSelectValue() {
                return $selectFirst.value;
            }

            function getSecondSelectValue() {
                return $selectSecond.value;
            }

            buildWindowSelects();

            var canvas = new root.Canvas();
            canvas.$canvas.classList.add('hide');
            canvas.render(self);

            $selectFirst.addEventListener('change', function () {
                $selectOperation.children[0].selected = 'selected';
                $selectOperation.disabled = (getFirstSelectValue() && getSecondSelectValue()) ? '' : 'disabled';
                canvas.markAsNotActive();
            });

            $selectSecond.addEventListener('change', function () {
                $selectOperation.children[0].selected = 'selected';
                $selectOperation.disabled = (getFirstSelectValue() && getSecondSelectValue()) ? '' : 'disabled';
                canvas.markAsNotActive();
            });

            $selectOperation.addEventListener('change', function (evt) {
                var $selected = this.children[evt.target.selectedIndex];

                // If select default option do nothing.
                if (!$selected.value || !getFirstSelectValue() || !getSecondSelectValue()) {
                    return;
                }

                var firstWindow = wm.getWindowsById($selectFirst.value);
                var secondWindow = wm.getWindowsById($selectSecond.value);

                var firstPicture = firstWindow.settings.picture;
                var secondPicture = secondWindow.settings.picture;

                canvas.setWidth(Math.max(firstPicture.width, secondPicture.width));
                canvas.setHeight(Math.max(firstPicture.height, secondPicture.height));
                canvas.$canvas.classList.remove('hide');

                root.OperationsOnePoint.onePointLogical({
                    workspace: canvas,
                    operation: $selected.value,
                    firstPicture: firstPicture,
                    secondPicture: secondPicture
                });
            });
        });
    };

    // Exports `LogicalTool`.
    return (root.LogicalTool = LogicalTool);

}(this));
