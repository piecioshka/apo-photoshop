(function (root) {
    'use strict';

    var Bootstrap = {
        setup: function () {
            var menu = root.App.menu = new root.MenuBuilder();
            var wm = root.App.windowManager = new root.WindowManager();

            // Set title of application.
            root.document.title = root.Locale.get('NAME');

            root.Status.init();

            function setDefaultState() {
                menu.fileSaveMenuItem.enabled = false;
                menu.closeActiveWindowMenuItem.enabled = false;
                menu.closeAllWindowsMenuItem.enabled = true;

                menu.editRestoreMenuItem.enabled = false;

                menu.toolsDuplicateMenuItem.enabled = false;
                menu.toolsLutMenuItem.enabled = false;
                menu.toolsUOPMenuItem.enabled = false;
                menu.toolsObjectsRecognitionMenuItem.enabled = false;
                menu.toolsStopMotionSequenceMenuItem.enabled = false;

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

                menu.operationsOnePointArithmeticalLogicalMenuItem.enabled = false;

                menu.operationsNeighbourhoodSmoothingMenuItem.enabled = false;
                menu.operationsNeighbourhoodSharpenMediumMenuItem.enabled = false;
                menu.operationsNeighbourhoodSharpenMinimalMenuItem.enabled = false;
                menu.operationsNeighbourhoodSharpenMaximalMenuItem.enabled = false;

                menu.morphologicalOperationsMenuItem.enabled = false;
                menu.turtleOperationsMenuItem.enabled = false;
                menu.imageColorfulOperationsMenuItem.enabled = false;
            }

            function setPictureWindowState() {
                menu.fileSaveMenuItem.enabled = true;
                menu.closeActiveWindowMenuItem.enabled = true;
                menu.closeAllWindowsMenuItem.enabled = true;

                menu.editRestoreMenuItem.enabled = true;

                menu.toolsDuplicateMenuItem.enabled = true;
                menu.toolsLutMenuItem.enabled = true;
                menu.toolsUOPMenuItem.enabled = true;
                menu.toolsObjectsRecognitionMenuItem.enabled = true;
                menu.toolsStopMotionSequenceMenuItem.enabled = false;

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

                menu.operationsOnePointArithmeticalLogicalMenuItem.enabled = true;

                menu.operationsNeighbourhoodSmoothingMenuItem.enabled = true;
                menu.operationsNeighbourhoodSharpenMediumMenuItem.enabled = true;
                menu.operationsNeighbourhoodSharpenMinimalMenuItem.enabled = true;
                menu.operationsNeighbourhoodSharpenMaximalMenuItem.enabled = true;

                menu.morphologicalOperationsMenuItem.enabled = true;
                menu.turtleOperationsMenuItem.enabled = true;
                menu.imageColorfulOperationsMenuItem.enabled = true;
            }

            function setMultiplePicturesWindowState() {
                menu.closeActiveWindowMenuItem.enabled = true;
                menu.closeAllWindowsMenuItem.enabled = true;

                menu.toolsObjectsRecognitionMenuItem.enabled = true;
                menu.toolsStopMotionSequenceMenuItem.enabled = true;
            }

            setDefaultState();

            wm.on(root.AbstractWindow.EVENTS.ACTIVE_WINDOW, function (params) {
                params.win.emit(root.AbstractWindow.EVENTS.ACTIVE_WINDOW);
                wm.inactivateWindowsWithout(params.win);

                if (params.win instanceof root.PictureWindow) {
                    setPictureWindowState();
                } else if (params.win instanceof root.MultiplePicturesWindow) {
                    setMultiplePicturesWindowState();
                } else {
                    setDefaultState();
                }
            });

            wm.on(root.AbstractWindow.EVENTS.CLOSE_WINDOW, function (params) {
                // Found all windows, with `contextWindow` equal to that window.
                var relatedWindows = wm.getWindowsWithThatContextWindow(params.win);

                _.each(relatedWindows, function (win) {
                    wm.closeWindow(win);
                });

                wm.closeWindow(params.win);

                // Activate last added window.
                var lastAddedWindow = wm.getLast();

                if (lastAddedWindow !== null) {
                    wm.emit(root.AbstractWindow.EVENTS.ACTIVE_WINDOW, { win: lastAddedWindow });
                } else {
                    setDefaultState();
                }
            });

            root.document.body.classList.add(this.translatePlatform(process.platform));
        },

        translatePlatform: function (platform) {
            if (_.contains(['win32', 'win64'], platform)) {
                platform = 'windows';
            } else if ('darwin' === platform) {
                platform = 'macosx';
            } else if ('linux' === platform) {
                platform = 'linux';
            } else {
                throw new Error(root.Locale.get('MSG_ERR_UNRECOGNIZED_PLATFORM'));
            }

            return platform;
        }
    };

    // Block modify context.
    _.bindAll(Bootstrap, 'setup');

    // Waiting for trigger `load` event by engine.
    root.addEventListener('load', Bootstrap.setup);

    // Handle each `keydown` event and check about shortcut.
    root.addEventListener('keydown', root.KeyboardShortcut.handler);

}(this));
