(function (root) {
    'use strict';

    var locale = require('cjson').load('./locale/pl_PL.json');

    function Menu() {
        this.gui = null;
        this.windowMenu = null;

        this.initialize();
    }

    Menu.prototype.initialize = function () {
        // Set reference to node-webkit gui interface.
        this.gui = require('nw.gui');

        // Create main window menu.
        this.windowMenu = new this.gui.Menu({ type: 'menubar' });

        // If application run under Mac OS must set that option, to fixed main window menu.
        if (root.Utilities.isDarwin()) {
            this.windowMenu.createMacBuiltin(locale.NAME, {
                hideEdit: true,
                hideWindow: true
            });
        }

        // Assign main menu to window.
        this.gui.Window.get().menu = this.windowMenu;

        // Create `file` option in main menu.
        this.file();

        // Create `box` option in main menu.
        this.box();

        // Create `help` option in main menu.
        this.help();
    };

    Menu.prototype.file = function () {
        // Create file menu.
        var fileMenu = new this.gui.Menu();

        // Add open file option.
        this.openFile(fileMenu);

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: locale.FILE,
            submenu: fileMenu
        }));
    };

    Menu.prototype.openFile = function (fileMenu) {
        var self = this;
        var openFileShortcut = 'Ctrl+O';

        function runOpenFile() {
            self.emit(Menu.EVENTS.FILE_OPEN);
        }

        // Add shortcut.
        root.KeyboardShortcut.add(openFileShortcut, runOpenFile);

        // Append to file menu `open` option.
        fileMenu.append(new this.gui.MenuItem({
            label: locale.FILE_OPEN + ' ' + openFileShortcut,
            click: runOpenFile
        }));
    };

    Menu.prototype.box = function () {
        // Create file menu.
        var boxMenu = new this.gui.Menu();

        // Add histogram option.
        this.histogram(boxMenu);

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: locale.BOX,
            submenu: boxMenu
        }));
    };

    Menu.prototype.histogram = function (boxMenu) {
        var self = this;
        var histogramShortcut = 'Ctrl+Shift+H';

        function runHistogram() {
            self.emit(Menu.EVENTS.BOX_HISTOGRAM);
        }

        // Add shortcut.
        root.KeyboardShortcut.add(histogramShortcut, runHistogram);

        // Append to file menu `open` option.
        boxMenu.append(new this.gui.MenuItem({
            label: locale.BOX_HISTOGRAM + ' ' + histogramShortcut,
            click: runHistogram
        }));
    };

    Menu.prototype.help = function () {

        // Create help menu.
        var helpMenu = new this.gui.Menu();

        // Add sample option.
        this.sample(helpMenu);

        // Append to main window menu new option.
        this.windowMenu.append(new this.gui.MenuItem({
            label: locale.ABOUT,
            submenu: helpMenu
        }));
    };

    Menu.prototype.sample = function (helpMenu) {
        var self = this;
        var sampleShortcut = 'Ctrl+Shift+S';

        function runSample() {
            self.emit(Menu.EVENTS.SAMPLE);
        }

        // Add shortcut.
        root.KeyboardShortcut.add(sampleShortcut, runSample);

        // Append to help menu `sample` option.
        helpMenu.append(new this.gui.MenuItem({
            label: locale.SAMPLE + ' ' + sampleShortcut,
            click: runSample
        }));
    };

    Menu.EVENTS = {
        FILE_OPEN: 'open',
        BOX_HISTOGRAM: 'histogram',
        SAMPLE: 'sample'
    };

    // Extend `Menu` module with events.
    _.extend(Menu.prototype, root.EventEmitter);

    // Export `Menu`.
    return (root.Menu = Menu);

}(this));
