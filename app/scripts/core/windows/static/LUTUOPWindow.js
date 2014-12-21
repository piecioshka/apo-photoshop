(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var LUTUOPWindow = function LUTUOPWindow(params) {
        // console.info('new LUTUOPWindow', params);

        this.settings = {
            picture: null,
            canvas: {
                original: null,
                current: null
            }
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

    LUTUOPWindow.prototype = new root.AbstractWindow();

    LUTUOPWindow.prototype.initialize = function () {
        this.$window.classList.add('lut-uop-window');

        // Update title of window.
        this.updateTitle(root.Locale.get('BOX_LUT_UOP') + ' - ' + this.settings.picture.name);

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildTable();
        });

        // Render window.
        this.render();
    };

    LUTUOPWindow.prototype.buildTable = function () {
        var origHist = this.settings.canvas.original.getCountingColorList();
        var currHist = this.settings.canvas.current.getCountingColorList();

        _.each(currHist, function (item, index) {
            if (origHist[index] === 0 && currHist[index] === 0) {
                delete origHist[index];
                delete currHist[index];
            }
        });

        var template = doc.querySelector('#template-lut-uop-static').innerHTML;
        var compiled = _.template(template);
        var renderedTemplate = compiled({
            original: origHist,
            current: currHist
        });

        this.appendContent(renderedTemplate);

        setTimeout(function () {

        }, 0);
    };

    // Exports `LUTUOPWindow`.
    return (root.LUTUOPWindow = LUTUOPWindow);

}(this));
