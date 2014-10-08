(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var Canvas = function (params) {
        this.settings = params;

        this.placeHolder = null;
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
        this.placeHolder = win;
    };

    Canvas.prototype.render = function () {
        this.placeHolder.setContent(this.$canvas);
    };

    Canvas.prototype.buildImage = function (params) {
        this.ctx.drawImage(params.image, 0, 0, params.width, params.height);
    };

    Canvas.prototype.buildBarGraph = function (items) {
        var BAR_WIDTH = parseInt(this.settings.width / items.length, 10);
        this.ctx.fillStyle = 'rgb(100, 100, 100)';

        items.forEach(function (size, index) {
            var w = BAR_WIDTH;
            var h = size * this.settings.height / 100;
            var x = index * BAR_WIDTH;
            var y = this.settings.height - h;
            this.ctx.fillRect(x, y, w, h);
        }, this);
    };

    Canvas.prototype.buildSample = function () {
        this.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.ctx.fillRect(0, 0, 200, 100);
    };

    // Extend `Canvas` module with events.
    _.extend(Canvas.prototype, root.EventEmitter);

    // Export `Canvas`.
    return (root.Canvas = Canvas);

}(this));
