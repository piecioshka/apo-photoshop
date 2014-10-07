(function (root) {
    'use strict';

    var InternalWindowManager = function () {
        this._windows = [];
    };

    InternalWindowManager.prototype.addWindow = function (win) {
        var self = this;

        win.on(root.InternalWindow.EVENTS.ACTIVE_WINDOW, function () {
            self.inactivateWindowsWithout(win);
        });

        win.emit(root.InternalWindow.EVENTS.ACTIVE_WINDOW);

        this._windows.push(win);
    };

    InternalWindowManager.prototype.inactivateWindowsWithout = function (windowToActive) {
        // Inactivate rest windows.
        this._windows.forEach(function (win) {
            if (win !== windowToActive) {
                win.emit(root.InternalWindow.EVENTS.INACTIVE_WINDOW);
            }
        });
    };

    // Extend `FileChooser` module with events.
    _.extend(InternalWindowManager.prototype, root.EventEmitter);

    // Exports `InternalWindowManager`.
    return (root.InternalWindowManager = InternalWindowManager);

}(this));
