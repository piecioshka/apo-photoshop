(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var Canvas = function (params) {
        this.settings = params;

        this.$placeHolder = null;
        this.$canvas = null;
        this.ctx = null;

        this.initialize();
    };

    Canvas.prototype.initialize = function () {
        this.$canvas = doc.createElement('canvas');
        this.$canvas.setAttribute('width', this.settings.width);
        this.$canvas.setAttribute('height', this.settings.height);
        this.ctx = this.$canvas.getContext('2d');
    };

    Canvas.prototype.setWindow = function (win) {
        this.$placeHolder = win;
    };

    Canvas.prototype.render = function () {
        this.$placeHolder.setContent(this.$canvas);
    };

    // Extend `Canvas` module with events.
    _.extend(Canvas.prototype, root.EventEmitter);

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));
