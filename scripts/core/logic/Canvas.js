(function (root) {
    'use strict';

    var extend = require('extend');

    // Aliases.
    var doc = root.document;

    var Canvas = function (params) {
        this.settings = extend({}, params);

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

    Canvas.prototype.onEachPixel = function (handler, ctx) {
        var i, j;
        ctx = ctx || this;

        for (i = 0; i < this.settings.width; ++i) {
        // for (i = 30; i < 50; ++i) {
            for (j = 0; j < this.settings.height; ++j) {
            // for (j = 20; j < 30; ++j) {
                handler.call(ctx, i, j);
            }
        }
    };

    Canvas.prototype.render = function () {
        this.$placeHolder.setContent(this.$canvas);
    };

    // Extend `Canvas` module with events.
    _.extend(Canvas.prototype, root.EventEmitter);

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));
