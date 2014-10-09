(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var SampleWindow = function (params) {
        console.log('new SampleWindow', params);

        this.settings = {
            renderAreaID: '#app'
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(this.settings.renderAreaID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;

        // Flag tell that window is active.
        this.isActive = false;

        this.canvas = null;

        this.setup();
        this.initialize();
    };

    SampleWindow.prototype = new AbstractWindow();
    SampleWindow.prototype.constructor = SampleWindow;

    SampleWindow.prototype.initialize = function () {
        // Update title of window.
        this.updateTitle('Sample');

        // Append window list.
        root.App.windowManager.addWindow(this);

        // Create `Canvas` instance.
        this.canvas = new root.Canvas({
            width: 200,
            height: 100
        });

        // Set reference to window, where will be rendered.
        this.canvas.setWindow(this);

        // Create $canvas space.
        this.canvas.render();

        // Listen on window render.
        this.on(AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Create something stupid.
            this.buildSample();
        });

        // Render window.
        this.render();
    };

    SampleWindow.prototype.buildSample = function () {
        this.canvas.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.canvas.ctx.fillRect(0, 0, 200, 100);
    };

    // Exports `SampleWindow`.
    return (root.SampleWindow = SampleWindow);

}(this));
