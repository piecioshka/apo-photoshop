(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var PictureWindow = function PictureWindow(params) {
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
            height: 150,
            // Array of numbers of colors.
            list: [],
            average: 0
        };

        this.isModified = false;
        
        this.setup();
        this.initialize();
    };

    PictureWindow.prototype = new root.AbstractWindow();

    PictureWindow.prototype.initialize = function () {
        this.$window.classList.add('picture-window');

        // Listen when window will be rendered.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            this.settings.picture.canvas.render(this);
            this.histogram.list = this.settings.picture.canvas.getCountingColorList();
            this.histogram.average = ~~root.Utilities.average.apply(this, this.histogram.list);
            this._buildBarGraph();
            this._updateHistogram();
            this._renderHistogramInformation();

            // Set static width.
            this.setRigidWidth();

            // Update title of window.
            this.updateTitle(this.settings.picture.name);

            // Append window list.
            root.App.windowManager.addWindow(this);

            this.emit(root.AbstractWindow.EVENTS.READY);
        });

        this.on(root.AbstractWindow.EVENTS.CLOSE_WINDOW, function () {
            if (this.isModified && root.confirm(root.Locale.get('FILE_SAVE_AS_CONFIRM'))) {
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
            saveFile.saveCanvas(params[0].file, this.settings.picture.canvas);
            this.updateTitle(params[0].name);
        }, this);
    };

    PictureWindow.prototype.getPicture = function () {
        return this.settings.picture;
    };

    PictureWindow.prototype.getCopyOfPicture = function () {
        var picture = this.settings.picture;

        return {
            file: picture.file,
            name: picture.name,
            height: picture.height,
            width: picture.width,
            img: picture.img,
            canvas: picture.canvas.copy()
        };
    };

    // -----------------------------------------------------------------------------------------------------------------

    PictureWindow.prototype.setPrimaryState = function () {
        var picture = this.settings.picture;
        picture.canvas.loadGrayScaleImage(picture.img, picture.width, picture.height);
        this.setPrimaryTitle();
        this.isModified = false;
        this.histogram.list = this.settings.picture.canvas.getCountingColorList();
        this.histogram.average = ~~root.Utilities.average.apply(this, this.histogram.list);
        this.emit(root.PictureWindow.EVENTS.PICTURE_MODIFY);
    };

    PictureWindow.prototype.setModifiedState = function () {
        this.setModifiedTitle();
        this.isModified = true;
        this.histogram.list = this.settings.picture.canvas.getCountingColorList();
        this.histogram.average = ~~root.Utilities.average.apply(this, this.histogram.list);
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

    PictureWindow.prototype._returnsNormalizedHistogram = function () {
        var pixels = this.histogram.list;
        var max = root.Utilities.max.apply(this, pixels);
        var histHeight = this.histogram.height;

        return _.map(pixels, function (item) {
            return parseInt(item / max * histHeight, 10);
        });
    };

    PictureWindow.prototype._calculateAverageOfNormalizedHistogram = function () {
        var histNorm = this._returnsNormalizedHistogram();
        return ~~root.Utilities.average.apply(this, histNorm);
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

        // Create average label.
        var $average = doc.createElement('span');
        $average.classList.add('hist-info-average');
        $average.innerHTML = 'Średnia: <b>' + this.histogram.average + '</b> (norm: <b>' + this._calculateAverageOfNormalizedHistogram() + '</b>)</b>';

        // Set left margin to labels.
        $palette.style.left = $levels.style.left = $color.style.left = $average.style.left = pictureWidth + margin + 'px';

        // Add labels to container.
        this.$content.appendChild($palette);
        this.$content.appendChild($color);
        this.$content.appendChild($levels);
        this.$content.appendChild($average);

        function mouseMoveHandler(evt) {
            var hist = self.histogram.list;
            var histNorm = self._returnsNormalizedHistogram();

            var x = evt.offsetX;
            var w = 1;
            var h = histNorm[x] * histHeight / 100;
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
                $levels.innerHTML = 'Liczba: <b>' + hist[x] + '</b> (norm: <b>' + histNorm[x] + '</b>)';
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
        this._paintHistogram();
        this._paintHistogramAverage();
    };

    PictureWindow.prototype._paintHistogram = function () {
        this.histogram.canvas.clear();

        var histNorm = this._returnsNormalizedHistogram();
        var histHeight = this.histogram.height;
        var ctx = this.histogram.canvas.ctx;

        ctx.fillStyle = 'rgb(0, 0, 0)';

        _.each(histNorm, function (size, index) {
            var w = 1;
            var h = size * histHeight / 100;
            var x = index * w;
            var y = histHeight - h;

            ctx.fillRect(x, y, w, h);
        }, this);
    };

    PictureWindow.prototype._paintHistogramAverage = function () {
        var histHeight = this.histogram.height;
        var averageNorm = (histHeight - 1) - this._calculateAverageOfNormalizedHistogram();
        this.histogram.canvas.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.histogram.canvas.ctx.fillRect(0, averageNorm, this.histogram.width, 1);
    };

    PictureWindow.EVENTS = {
        PICTURE_MODIFY: 'picture:modify'
    };

    // Exports `PictureWindow`.
    return (root.PictureWindow = PictureWindow);

}(this));
