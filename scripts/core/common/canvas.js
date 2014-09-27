(function (root) {
    'use strict';

    var Canvas = function (params) {
        this.settings = params;

        this.$el = document.querySelector(this.settings.place);
        this.canvas = null;
        this.ctx = null;

        this.initialize();
    };

    Canvas.prototype.initialize = function () {
        this.canvas = document.createElement('canvas');
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

    Canvas.prototype.loadImage = function (url) {
        var img = new Image();
        img.addEventListener('load', function () {
            console.log('image loaded', this);
        });
        img.src = url;
    };

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));
