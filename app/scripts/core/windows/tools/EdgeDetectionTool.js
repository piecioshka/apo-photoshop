(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var EdgeDetectionTool = function EdgeDetectionTool(params) {
        // console.info('new EdgeDetectionTool', params);

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

    EdgeDetectionTool.prototype = new AbstractWindow();

    EdgeDetectionTool.prototype.initialize = function () {
        this.$window.classList.add('edge-detection-tool');

        // Update title of window.
        this.updateTitle(root.Locale.get('OPERATIONS_NEIGHBOURHOOD_EDGE_DETECTION') + ' - ' +  this.settings.picture.name);

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

    EdgeDetectionTool.prototype.buildUI = function () {
        var self = this;
        var template = doc.querySelector('#template-edge-detection-tool').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled();

        this.appendContent(renderedTemplate);

        setTimeout(function () {

        }, 0);
    };

    EdgeDetectionTool.DEFAULT_LEVEL = 0;

    // Exports `EdgeDetectionTool`.
    return (root.EdgeDetectionTool = EdgeDetectionTool);

}(this));
