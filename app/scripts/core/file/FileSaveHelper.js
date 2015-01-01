(function (root) {
    'use strict';

    var fs = require('fs');

    // Aliases.
    var doc = root.document;

    var FileSaveHelper = function FileSaveHelper(params) {
        this.settings = {};
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(root.WindowManager.RENDER_AREA_ID);
        this.$input = null;

        this.initialize();
    };

    FileSaveHelper.prototype = new root.AbstractFileHelper();
    FileSaveHelper.prototype.constructor = FileSaveHelper;

    FileSaveHelper.prototype.createInput = function () {
        var self = this;

        this.$input = doc.createElement('input');
        this.$input.setAttribute('type', 'file');
        this.$input.setAttribute('nwsaveas', '');
        this.$input.classList.add('hide');
        this.$input.addEventListener('change', function () {
            var files = [];

            _.each(self.$input.files, function (image) {
                files.push({
                    file: image.path,
                    name: image.name
                });
            });

            self.emit(root.AbstractFileHelper.EVENTS.SAVE_FILE, files);
            self.remove();
        });
        this.$input.click();
    };

    FileSaveHelper.prototype.saveCanvas = function (name, canvas) {
        fs.writeFileSync(name, canvas.toBuffer());
    };

    // Exports `FileSaveHelper`.
    return (root.FileSaveHelper = FileSaveHelper);
}(this));
