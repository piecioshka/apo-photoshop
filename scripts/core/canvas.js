(function (root) {
    'use strict';

    var doc = root.document;

    var Canvas = function (params) {
        this.settings = params;

        this.$el = doc.querySelector(this.settings.place);
        this.canvas = null;
        this.ctx = null;

        this.initialize();
    };

    Canvas.prototype.initialize = function () {
        this.canvas = doc.createElement('canvas');
        this.canvas.width = this.settings.width;
        this.canvas.height = this.settings.height;
    };

    Canvas.prototype._clear = function () {
        this.$el.innerHTML = '';
    };

    Canvas.prototype.render = function () {
        this._clear();
        this.$el.appendChild(this.canvas);
    };

    Canvas.prototype.buildSample = function () {
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.ctx.fillRect(10, 20, 100, 200);
    };

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));
