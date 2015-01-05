(function (root) {
    'use strict';

    var WindowManager = function () {
        this._windows = [];
    };

    WindowManager.RENDER_AREA_ID = '#app';

    WindowManager.prototype.addWindow = function (win) {
        var st, left, top;
        var CASCADE_MARGIN = 22;

        var active = this.getActiveWindow();

        if (active !== null) {
            st = root.getComputedStyle(active.$window, null);
            left = parseInt(st.getPropertyValue('left'), 10) || 0;
            top = parseInt(st.getPropertyValue('top'), 10) || 0;

            // Open cascaded
            win.$window.style.left = left + CASCADE_MARGIN + 'px';
            win.$window.style.top = top + CASCADE_MARGIN + 'px';
        }

        this._windows.push(win);

        this.emit(root.AbstractWindow.EVENTS.ACTIVE_WINDOW, { win: win });
    };

    WindowManager.prototype.removeWindow = function (win) {
        win.remove();

        var index = _.indexOf(this._windows, win);

        // Removed instance.
        delete this._windows[index];

        // Clear list index.
        this._windows.splice(index, 1);
    };

    WindowManager.prototype.inactivateWindowsWithout = function (windowToActive) {
        // Inactivate rest windows.
        _.each(this._windows, function (win) {
            if (win !== windowToActive) {
                win.emit(root.AbstractWindow.EVENTS.INACTIVE_WINDOW);
            }
        });
    };

    WindowManager.prototype.getActiveWindow = function () {
        var activeWindows = _.filter(this._windows, function (win) {
            return win.isActive;
        });

        _.assert(activeWindows.length <= 1, 'WindowManager#getActiveWindow: is more than one active windows');

        // Returns (first from list) active window is exists or returns `null`.
        return activeWindows[0] || null;
    };

    WindowManager.prototype.getLast = function () {
        return _.last(this._windows) || null;
    };

    WindowManager.prototype.getOnlyPictureWindows = function () {
        return _.filter(this._windows, function (win) {
            return win instanceof root.PictureWindow;
        });
    };

    WindowManager.prototype.getWindowsById = function (id) {
        return _.find(this._windows, { id: id });
    };

    WindowManager.prototype.each = function (callback, ctx) {
        return _.each(this._windows, callback, ctx || this);
    };

    WindowManager.prototype.getWindowsWithThatContextWindow = function (contextWindow) {
        _.each(this._windows, function (win) {
            if (win.contextWindow === contextWindow) {
                this.emit(root.AbstractWindow.EVENTS.CLOSE_WINDOW, { win: win });
            }
        }, this);
    };

    // Extend `WindowManager` module with events.
    _.extend(WindowManager.prototype, root.EventEmitter);

    // Exports `WindowManager`.
    return (root.WindowManager = WindowManager);

}(this));
