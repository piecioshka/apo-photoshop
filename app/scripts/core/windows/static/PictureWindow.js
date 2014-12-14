(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var PictureWindow = function PictureWindow(params) {
        // console.info('new PictureWindow', params);

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

        this.histogram = {
            canvas: undefined,
            width: 256,
            height: 144
        };
        
        this.setup();
        this.initialize();
    };

    PictureWindow.prototype = new root.AbstractWindow();

    PictureWindow.prototype.initialize = function () {
        this.$window.classList.add('picture-window');

        this.updateTitle(this.settings.picture.name);

        root.App.windowManager.addWindow(this);

        // Listen when window will be rendered.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            this.settings.picture.canvas.render(this);
            this._buildBarGraph();
            this._updateHistogram();
            this.setRigidWidth();
        }, this);

        // Listen when picture will be modify by operation.
        this.on(root.PictureWindow.EVENTS.PICTURE_MODIFY, function () {
            this._updateHistogram();
        }, this);

        // Render window.
        this.render();
    };

    PictureWindow.prototype.setPrimaryState = function () {
        var pic = this.settings.picture;
        pic.canvas.loadGrayScaleImage(pic.img, pic.width, pic.height);
        this.updateTitle(this.getTitle().replace(/\* /, ''));
        this.emit(root.PictureWindow.EVENTS.PICTURE_MODIFY);
    };

    PictureWindow.prototype.setModifiedState = function () {
        var title = this.getTitle();
        if (!(/\* /).test(title)) {
            this.updateTitle('* ' + title);
        }
        this.emit(root.PictureWindow.EVENTS.PICTURE_MODIFY);
    };

    PictureWindow.prototype._normalize = function (pixels) {
        var max = root.Utilities.max.apply(this, pixels);

        return pixels.map(function (item) {
            return item * this.histogram.height / max;
        }, this);
    };

    PictureWindow.prototype._buildBarGraph = function () {
        this.histogram.canvas = new root.Canvas({
            width: this.histogram.width,
            height: this.histogram.height
        });

        this.histogram.canvas.$canvas.classList.add('canvas-histogram');
        this.histogram.canvas.render(this);
    };

    PictureWindow.prototype._updateHistogram = function () {
        var hist = this.settings.picture.canvas.getHistogram();
        hist = this._normalize(hist);

        // Draw bars in histogram.
        this._paintHistogram(hist);

        // Draw horizontal line as average of histogram.
        var average = this.settings.picture.canvas.getHistogramAverage();
        var max = root.Utilities.max.apply(this, hist);
        average = this._normalize([0, average, max])[1];
        this._paintHistogramAverage(average);
    };

    PictureWindow.prototype._paintHistogram = function (normalizeHist) {
        this.histogram.canvas.clear();
        this.histogram.canvas.ctx.fillStyle = 'rgb(0, 0, 0)';

        normalizeHist.forEach(function (size, index) {
            var w = 1;
            var h = size * this.histogram.height / 100;
            var x = index * w;
            var y = this.histogram.height - h;

            this.histogram.canvas.ctx.fillRect(x, y, w, h);
        }, this);
    };

    PictureWindow.prototype._paintHistogramAverage = function (average) {
        var level = this.histogram.height - average;
        this.histogram.canvas.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.histogram.canvas.ctx.fillRect(0, level, this.histogram.width, 1);
    };

    PictureWindow.EVENTS = {
        PICTURE_MODIFY: 'picture:modify'
    };

    // Exports `PictureWindow`.
    return (root.PictureWindow = PictureWindow);

}(this));
