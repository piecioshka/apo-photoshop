(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var StopMotionSequenceWindow = function StopMotionSequenceWindow(contextWindow, params) {
        this.contextWindow = contextWindow;
        this.settings = {
            pictures: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;
        this.isActive = false;

        this._interval = null;
        this._screen = null;

        _.bindAll(this, 'startMovie', 'stopMovie');

        this.setup();
        this.initialize();
    };

    StopMotionSequenceWindow.prototype = new root.AbstractWindow();

    StopMotionSequenceWindow.prototype.initialize = function () {
        this.$window.classList.add('stop-motion-sequence-window');

        // Listen on window render.
        this.on(root.AbstractWindow.EVENTS.RENDER_WINDOW, function () {
            // Put image to canvas.
            this.buildUI();

            // Update title (add each file name).
            this.updateTitle(root.Locale.get('TOOLS_STOP_MOTION_SEQUENCE') + ' - ' + _.map(this.settings.pictures, function (frame) {
                return frame.name;
            }).join(', '));

            // Append window list.
            root.App.windowManager.addWindow(this);

            this.emit(root.AbstractWindow.EVENTS.READY);
        });

        // Render window.
        this.render();
    };

    StopMotionSequenceWindow.prototype.buildUI = function () {
        var pics = this.settings.pictures;

        // 1. Get width and height from first image
        var widthFirstImage = _.first(pics).width;
        var heightFirstImage = _.first(pics).height;

        // 2. Check that all images are the same dimensions
        var badPictures = _.filter(pics, function (pic) {
            return (pic.width !== widthFirstImage || pic.height !== heightFirstImage);
        });

        if (badPictures.length !== 0) {
            root.App.windowManager.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: this });
            root.alert(root.Locale.get('MSG_ERR_DIFFERENT_DIMENSION'));
            return;
        }

        // 3. Create <canvas>
        this._screen = new root.Canvas({
            width: widthFirstImage,
            height: heightFirstImage
        });
        this._screen.$canvas.classList.add('canvas-movie');
        this._screen.render(this);

        // 4. Show first frame.
        this.showFirstFrame();

        // 5. Create 2 buttons: play, stop
        var $fieldset = doc.createElement('fieldset');

        var $playButton = doc.createElement('button');
        $playButton.textContent = root.Locale.get('TOOLS_PLAY');

        var $stopButton = doc.createElement('button');
        $stopButton.textContent = root.Locale.get('TOOLS_STOP');

        $fieldset.appendChild($playButton);
        $fieldset.appendChild($stopButton);

        // 6. Create handlers for that buttons.
        $playButton.addEventListener('click', this.startMovie);
        $stopButton.addEventListener('click', this.stopMovie);

        // 7. Add button to window.
        this.appendContent($fieldset);
    };

    StopMotionSequenceWindow.prototype.showFirstFrame = function () {
        var pics = this.settings.pictures;
        var firstFrame = pics[0];
        this._screen.ctx.drawImage(firstFrame.canvas.toImage(), 0, 0, firstFrame.width, firstFrame.height);
    };

    StopMotionSequenceWindow.prototype.startMovie = function () {
        var frame;
        var self = this;
        var pics = this.settings.pictures;
        var index = 0;
        var limit = pics.length;

        this.stopMovie();

        this._interval = root.setInterval(function () {
            if (index === limit) {
                self.stopMovie();
                return;
            }

            frame = pics[index];
            self._screen.ctx.drawImage(frame.canvas.toImage(), 0, 0, frame.width, frame.height);

            index++;
        }, StopMotionSequenceWindow.TIME);
    };

    StopMotionSequenceWindow.prototype.stopMovie = function () {
        if (this._interval) {
            root.clearInterval(this._interval);
            this.showFirstFrame();
        }
    };

    StopMotionSequenceWindow.TIME = 100;

    // Exports `StopMotionSequenceWindow`.
    return (root.StopMotionSequenceWindow = StopMotionSequenceWindow);

}(this));
