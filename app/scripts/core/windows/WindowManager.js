(function (root) {
    'use strict';

    var WindowManager = function () {
        this._windows = [];
    };

    WindowManager.prototype.addWindow = function (win) {
        var self = this;

        win.on(root.AbstractWindow.EVENTS.ACTIVE_WINDOW, function () {
            self.inactivateWindowsWithout(win);
        });

        win.on(root.AbstractWindow.EVENTS.CLOSE_WINDOW, function (params) {
            self.removeWindow(params.window);
        });

        win.emit(root.AbstractWindow.EVENTS.ACTIVE_WINDOW);

        this._windows.push(win);
    };

    WindowManager.prototype.removeWindow = function (windowToRemove) {
        var self = this;
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

    // Extend `FileChooser` module with events.
    _.extend(WindowManager.prototype, root.EventEmitter);

    // Exports `WindowManager`.
    return (root.WindowManager = WindowManager);

}(this));
