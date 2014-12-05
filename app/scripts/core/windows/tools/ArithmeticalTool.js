(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var ArithmeticalTool = function ArithmeticalTool(params) {
        // console.info('new ArithmeticalTool', params);

        this.settings = {
            image: null,
            canvas: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;

        // Flag tell that window is active.
        this.isActive = false;

        this.setup();
        this.initialize();
    };

    ArithmeticalTool.prototype = new AbstractWindow();

    ArithmeticalTool.prototype.initialize = function () {
        this.$window.classList.add('arithmetical-tool');

        // Update title of window.
        this.updateTitle('Operacje arytmetyczne');

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

        }, 0);
    };

    ArithmeticalTool.DEFAULT_LEVEL = 128;

    // Exports `ArithmeticalTool`.
    return (root.ArithmeticalTool = ArithmeticalTool);

}(this));
