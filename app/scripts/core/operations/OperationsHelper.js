(function (root) {
    'use strict';

    var OperationsHelper = {
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

    // Exports `OperationsHelper`.
    return (root.OperationsHelper = OperationsHelper);

}(this));
