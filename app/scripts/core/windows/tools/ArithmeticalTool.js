(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ArithmeticalTool = function ArithmeticalTool() {
        // console.info('new ArithmeticalTool');

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
        var wm = root.App.windowManager;
        var template = doc.querySelector('#template-arithmetical-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        requestAnimationFrame(function () {
            var $selectOperation = self.$content.querySelector('select.arithmetical-tool-operations');
            var $selectFirst = self.$content.querySelector('select.arithmetical-tool-first');
            var $selectSecond = self.$content.querySelector('select.arithmetical-tool-second');

            function buildOption(val, text) {
                var opt = doc.createElement('option');
                opt.value = val;
                opt.innerText = text;
                return opt;
            }

            function buildWindowSelects() {
                var picturesWindows = wm.getPictureWindows();

                $selectFirst.innerHTML = $selectSecond.innerHTML = '';

                $selectFirst.appendChild(buildOption(undefined, '---'));
                $selectSecond.appendChild(buildOption(undefined, '---'));

                _.each(picturesWindows, function (win) {
                    $selectFirst.appendChild(buildOption(win.id, win.getTitle()));
                    $selectSecond.appendChild(buildOption(win.id, win.getTitle()));
                });
            }

            buildWindowSelects();

            var canvas = new root.Canvas();
            canvas.$canvas.classList.add('hide');
            canvas.render(self);

            $selectOperation.addEventListener('change', function (evt) {
                var $selected = this.children[evt.target.selectedIndex];

                // If select default option do nothing.
                if (!$selected.value) {
                    return;
                }

                // buildWindowSelects();

                var firstWindow = wm.getWindowsById($selectFirst.value);
                var secondWindow = wm.getWindowsById($selectSecond.value);

                var firstPicture = firstWindow.settings.picture;
                var secondPicture = secondWindow.settings.picture;

                canvas.$canvas.classList.remove('hide');
                canvas.setWidth(Math.max(firstPicture.width, secondPicture.width));
                canvas.setHeight(Math.max(firstPicture.height, secondPicture.height));

                root.OperationsOnePoint.onePointArithmetical({
                    workspace: canvas,
                    operation: $selected.value,
                    firstPicture: firstPicture,
                    secondPicture: secondPicture
                });
            });
        });
    };

    // Exports `ArithmeticalTool`.
    return (root.ArithmeticalTool = ArithmeticalTool);

}(this));
