(function (root) {
    'use strict';

    var OperationHelper = {
        getWorkspace: function () {
            var title;
            var activeWindow = root.App.windowManager.getActiveWindow();

            // Support only picture window.
            if (activeWindow instanceof root.PictureWindow) {
                title = activeWindow.getTitle();

                if (!(/^\* /).test(title)) {
                    activeWindow.updateTitle('* ' + title);
                }
            }

            return activeWindow;
        }
    };

    // Exports `OperationHelper`.
    return (root.OperationHelper = OperationHelper);

}(this));
