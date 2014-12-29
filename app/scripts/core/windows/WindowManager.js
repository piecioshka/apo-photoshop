(function (root) {
    'use strict';

    var WindowManager = function () {
        this._windows = [];
    };

    WindowManager.RENDER_AREA_ID = '#app';

    WindowManager.prototype.addWindow = function (win) {
        var st, left, width;
        this._windows.push(win);

        var active = this.getActiveWindow();

        if (active !== null) {
            st = root.getComputedStyle(active.$window, null);
            left = parseInt(st.getPropertyValue('left'), 10) || 0;
            width = parseInt(st.getPropertyValue('width'), 10) || 0;

            // Open cascade? Disable for now.
            // win.$window.style.left = left + width + 'px';
        }

        this.emit(root.AbstractWindow.EVENTS.ACTIVE_WINDOW, { win: win });
    };

    WindowManager.prototype.removeWindow = function (windowToRemove) {
        var self = this;

        windowToRemove.removeDOM();

        this._windows.forEach(function (win, index) {
            if (win === windowToRemove) {
                self._windows.splice(index, 1);
            }
        });
    };

    WindowManager.prototype.inactivateWindowsWithout = function (windowToActive) {
        // Inactivate rest windows.
        this._windows.forEach(function (win) {
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

    WindowManager.prototype.getPictureWindows = function () {
        return _.filter(this._windows, function (win) {
            return win instanceof root.PictureWindow;
        });
    };

    WindowManager.prototype.getWindowsById = function (id) {
        return _.find(this._windows, { id: id });
    };

    // Extend `WindowManager` module with events.
    _.extend(WindowManager.prototype, root.EventEmitter);

    // Exports `WindowManager`.
    return (root.WindowManager = WindowManager);

}(this));
