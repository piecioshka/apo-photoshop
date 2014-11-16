(function (root) {
    'use strict';

    var OperationHelper = {
        getWorkspace: function () {
            var activeWindow = root.App.windowManager.getActiveWindow();

            // Support only picture window.
            if (!(activeWindow instanceof PictureWindow)) {
                return;
            }

            var title = activeWindow.getTitle();

            if (!(/^\* /).test(title)) {
                activeWindow.updateTitle('* ' + title);
            }

            return activeWindow;
        }
    };

    // Exports `OperationHelper`.
    return (root.OperationHelper = OperationHelper);

}(this));
