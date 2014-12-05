(function (root) {
    'use strict';

    var WindowManager = function () {
        this._windows = [];
    };

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
        var activeWindows = this._windows.filter(function (win) {
            return win.isActive;
        });

        if (activeWindows.length > 1) {
            throw new Error('WindowManager#getActiveWindow: is more than one active windows');
        }

        // Returns (first from list) active window is exists or returns `null`.
        return activeWindows[0] || null;
    };

    WindowManager.prototype.getLast = function () {
        return _.last(this._windows) || null;
    };

    // Extend `WindowManager` module with events.
    _.extend(WindowManager.prototype, root.EventEmitter);

    // Exports `WindowManager`.
    return (root.WindowManager = WindowManager);

}(this));
