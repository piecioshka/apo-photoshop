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
            height: 144,
            // Array of numbers of colors.
            list: []
        };

        this.isModified = false;
        
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
            this.histogram.list = this.settings.picture.canvas.getHistogram();
            this._buildBarGraph();
            this._updateHistogram();
            this._renderHistogramInformation();
            this.setRigidWidth();
        }, this);

        this.on(root.AbstractWindow.EVENTS.CLOSE_WINDOW, function () {
            if (this.isModified && confirm(root.Locale.get('FILE_SAVE_AS_CONFIRM'))) {
                this.saveAsPicture();
            }
        }, this);

        // Listen when picture will be modify by operation.
        this.on(root.PictureWindow.EVENTS.PICTURE_MODIFY, function () {
            this._updateHistogram();
        }, this);

        // Render window.
        this.render();
    };

    PictureWindow.prototype.saveAsPicture = function () {
        var saveFile = new root.FileSaveHelper();
        saveFile.once(root.AbstractFileHelper.EVENTS.SAVE_FILE, function (params) {
            var $canvas = this.settings.picture.canvas.$canvas;
            saveFile.saveCanvas(params[0].file, $canvas);
            this.updateTitle(params[0].name);
        }, this);
    };

    // -----------------------------------------------------------------------------------------------------------------

    PictureWindow.prototype.setPrimaryState = function () {
        var pic = this.settings.picture;
        pic.canvas.loadGrayScaleImage(pic.img, pic.width, pic.height);
        this.setPrimaryTitle();
        this.isModified = false;
        this.histogram.list = this.settings.picture.canvas.getHistogram();
        this.emit(root.PictureWindow.EVENTS.PICTURE_MODIFY);
    };

    PictureWindow.prototype.setModifiedState = function () {
        this.setModifiedTitle();
        this.isModified = true;
        this.histogram.list = this.settings.picture.canvas.getHistogram();
        this.emit(root.PictureWindow.EVENTS.PICTURE_MODIFY);
    };

    // -----------------------------------------------------------------------------------------------------------------

    PictureWindow.prototype.setPrimaryTitle = function () {
        this.updateTitle(this.getTitle().replace(/\* /, ''));
    };

    PictureWindow.prototype.setModifiedTitle = function () {
        var title = this.getTitle();
        if (!(/\* /).test(title)) {
            this.updateTitle('* ' + title);
        }
    };

    // -----------------------------------------------------------------------------------------------------------------

    PictureWindow.prototype._normalize = function (pixels) {
        var max = root.Utilities.max.apply(this, pixels);
        var height = this.histogram.height;

        return pixels.map(function (item) {
            return parseInt(item / max * height, 10);
        });
    };

    PictureWindow.prototype._renderHistogramInformation = function () {
        var self = this;
        var margin = 16;

        var histHeight = this.histogram.height;
        var pictureWidth = this.settings.picture.width;
        var ctx = this.histogram.canvas.ctx;

        // Create palette label.
        var $palette = doc.createElement('span');
        $palette.classList.add('hist-info-palette');

        // Create color label.
        var $color = doc.createElement('span');
        $color.classList.add('hist-info-color');
        $color.innerHTML = 'Kolor: <b>-</b>';

        // Create numbers label.
        var $levels = doc.createElement('span');
        $levels.classList.add('hist-info-numbers');
        $levels.innerHTML = 'Liczba: <b>-</b>';

        // Set left margin to labels.
        $palette.style.left = $levels.style.left = $color.style.left = pictureWidth + margin + 'px';

        // Add labels to container.
        this.$content.appendChild($palette);
        this.$content.appendChild($color);
        this.$content.appendChild($levels);

        function mouseMoveHandler(evt) {
            var hist = self.histogram.list;
            var histNormalize = self._normalize(hist);

            var x = evt.offsetX;
            var w = 1;
            var h = histNormalize[x] * histHeight / 100;
            var y = histHeight - h;

            // Refresh histogram.
            self._updateHistogram();

            // Put vertical bar - appender (blue).
            ctx.fillStyle = 'rgb(0, 0, 255)';
            ctx.fillRect(x, y, w, h);

            // Put vertical bar - appender (green).
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillRect(x, 0, w, y);

            // Firstly update <canvas>, next update text labels.
            setTimeout(function () {
                $color.innerHTML = 'Kolor: <b>#' + x + '</b> <i style="background: rgb(' + x + ', ' + x + ', ' + x + ')"></i>';
                $levels.innerHTML = 'Liczba: <b>' + hist[x] + '</b> (norm: <b>' + histNormalize[x] + '</b>)';
            }, 0);
        }

        // Add event for move cursor above <canvas>
        this.histogram.canvas.$canvas.addEventListener('mousemove', mouseMoveHandler);
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
        var hist = this.histogram.list;
        var histNorm = this._normalize(hist);

        // Draw bars in histogram.
        this._paintHistogram(histNorm);

        // Draw horizontal line as average of histogram.
        var average = this.settings.picture.canvas.getHistogramAverage();
        var max = root.Utilities.max.apply(this, hist);
        var averageNorm = this._normalize([0, average, max])[1];
        this._paintHistogramAverage(averageNorm);
    };

    PictureWindow.prototype._paintHistogram = function (normalizeHist) {
        var height = this.histogram.height;
        this.histogram.canvas.clear();
        var ctx = this.histogram.canvas.ctx;
        ctx.fillStyle = 'rgb(0, 0, 0)';

        normalizeHist.forEach(function (size, index) {
            var w = 1;
            var h = size * height / 100;
            var x = index * w;
            var y = height - h;

            ctx.fillRect(x, y, w, h);
        }, this);
    };

    PictureWindow.prototype._paintHistogramAverage = function (average) {
        var level = (this.histogram.height - 1) - average;
        this.histogram.canvas.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.histogram.canvas.ctx.fillRect(0, level, this.histogram.width, 1);
    };

    PictureWindow.EVENTS = {
        PICTURE_MODIFY: 'picture:modify'
    };

    // Exports `PictureWindow`.
    return (root.PictureWindow = PictureWindow);

}(this));
