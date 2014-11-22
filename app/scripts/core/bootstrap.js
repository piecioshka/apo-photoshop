(function (root) {
    'use strict';

    // Set title of application.
    root.document.title = root.locale.get('NAME');

    var Bootstrap = {
        setup: function () {
            var menu = root.App.menu = new root.Menu();
            var wm = root.App.windowManager = new root.WindowManager();

            function setDefaultState() {
                menu.fileCloseMenuItem.enabled = false;

                menu.editRestoreMenuItem.enabled = false;

                menu.boxHistogramMenuItem.enabled = false;
                menu.boxDuplicateMenuItem.enabled = false;
                menu.boxLutMenuItem.enabled = false;

                menu.operationsFlatteningHistogramMediumMethodMenuItem.enabled = false;
                menu.operationsFlatteningHistogramRandomMethodMenuItem.enabled = false;
                menu.operationsFlatteningHistogramNeighboudhoodMethodMenuItem.enabled = false;
                menu.operationsFlatteningHistogramCustomMethodMenuItem.enabled = false;

                menu.operationsOnePointNegativeMenuItem.enabled = false;
                menu.operationsOnePointThresholdMenuItem.enabled = false;
                menu.operationsOnePointPosterizeMenuItem.enabled = false;
                menu.operationsOnePointStretchingMenuItem.enabled = false;
                menu.operationsOnePointBrightnessRegulationMenuItem.enabled = false;
                menu.operationsOnePointContrastRegulationMenuItem.enabled = false;
                menu.operationsOnePointGammaRegulationMenuItem.enabled = false;
                menu.operationsNeighbourhoodSmoothingMenuItem.enabled = false;
            }

            function setPictureWindowState() {
                menu.fileCloseMenuItem.enabled = true;

                menu.editRestoreMenuItem.enabled = true;

                menu.boxHistogramMenuItem.enabled = true;
                menu.boxDuplicateMenuItem.enabled = true;
                menu.boxLutMenuItem.enabled = true;

                menu.operationsFlatteningHistogramMediumMethodMenuItem.enabled = true;
                menu.operationsFlatteningHistogramRandomMethodMenuItem.enabled = true;
                menu.operationsFlatteningHistogramNeighboudhoodMethodMenuItem.enabled = true;
                menu.operationsFlatteningHistogramCustomMethodMenuItem.enabled = true;

                menu.operationsOnePointNegativeMenuItem.enabled = true;
                menu.operationsOnePointThresholdMenuItem.enabled = true;
                menu.operationsOnePointPosterizeMenuItem.enabled = true;
                menu.operationsOnePointStretchingMenuItem.enabled = true;
                menu.operationsOnePointBrightnessRegulationMenuItem.enabled = true;
                menu.operationsOnePointContrastRegulationMenuItem.enabled = true;
                menu.operationsOnePointGammaRegulationMenuItem.enabled = true;

                menu.operationsNeighbourhoodSmoothingMenuItem.enabled = true;
            }

            function setHistogramWindowState() {
                menu.fileCloseMenuItem.enabled = true;

                menu.editRestoreMenuItem.enabled = false;

                menu.boxHistogramMenuItem.enabled = false;
                menu.boxDuplicateMenuItem.enabled = false;
                menu.boxLutMenuItem.enabled = false;

                menu.operationsFlatteningHistogramMediumMethodMenuItem.enabled = false;
                menu.operationsFlatteningHistogramRandomMethodMenuItem.enabled = false;
                menu.operationsFlatteningHistogramNeighboudhoodMethodMenuItem.enabled = false;
                menu.operationsFlatteningHistogramCustomMethodMenuItem.enabled = false;

                menu.operationsOnePointNegativeMenuItem.enabled = false;
                menu.operationsOnePointThresholdMenuItem.enabled = false;
                menu.operationsOnePointPosterizeMenuItem.enabled = false;
                menu.operationsOnePointStretchingMenuItem.enabled = false;
                menu.operationsOnePointBrightnessRegulationMenuItem.enabled = false;
                menu.operationsOnePointContrastRegulationMenuItem.enabled = false;
                menu.operationsOnePointGammaRegulationMenuItem.enabled = false;

                menu.operationsNeighbourhoodSmoothingMenuItem.enabled = false;
            }

            setDefaultState();

            wm.on(root.AbstractWindow.EVENTS.ACTIVE_WINDOW, function (params) {
                params.win.emit(root.AbstractWindow.EVENTS.ACTIVE_WINDOW);
                wm.inactivateWindowsWithout(params.win);

                var windowType = 'unknown';

                if (params.win instanceof root.PictureWindow) {
                    windowType = 'picture';
                    setPictureWindowState();
                } else if (params.win instanceof root.HistogramWindow) {
                    windowType = 'histogram';
                    setHistogramWindowState();
                }

                console.warn('Window "%s" (%s) is activated!', params.win.getTitle(), windowType);
            });

            wm.on(root.AbstractWindow.EVENTS.CLOSE_WINDOW, function (params) {
                wm.removeWindow(params.win);

                var windowType = 'unknown';

                if (params.win instanceof root.PictureWindow) {
                    windowType = 'picture';
                } else if (params.win instanceof root.HistogramWindow) {
                    windowType = 'histogram';
                }

                console.warn('Window "%s" (%s) is closed!', params.win.getTitle(), windowType);

                // Activate last added window.
                var lastAddedWindow = wm.getLast();

                if (lastAddedWindow !== null) {
                    wm.emit(root.AbstractWindow.EVENTS.ACTIVE_WINDOW, { win: lastAddedWindow });
                } else {
                    setDefaultState();
                }
            });
        }
    };

    // Block modify context.
    _.bindAll(Bootstrap, 'setup');

    // Waiting for trigger `load` event by engine.
    root.addEventListener('load', Bootstrap.setup);

    // Handle each `keydown` event and check about shortcut.
    root.addEventListener('keydown', root.KeyboardShortcut.handler);

}(this));
