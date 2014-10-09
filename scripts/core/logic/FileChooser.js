(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var FileChooser = function (params) {
        this.settings = {
            place: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(this.settings.place);
        this.$input = null;

        this.initialize();
    };

    FileChooser.prototype.initialize = function () {
        this.createInput();
        this.render();
    };

    FileChooser.prototype.createInput = function () {
        var self = this;

        this.$input = doc.createElement('input');
        this.$input.setAttribute('type', 'file');
        this.$input.classList.add('hide');
        this.$input.addEventListener('change', function () {
            var image = self.$input.files[0];
            self.emit(FileChooser.EVENTS.SELECT_FILE, {
                file: image.path,
                name: image.name
            });
            self.remove();
        });
        this.$input.click();
    };

    FileChooser.prototype.render = function () {
        this.$placeHolder.appendChild(this.$input);
    };

    FileChooser.prototype.remove = function () {
        this.$input.parentNode.removeChild(this.$input);
    };

    FileChooser.EVENTS = {
        SELECT_FILE: 'select'
    };

    // Extend `FileChooser` module with events.
    _.extend(FileChooser.prototype, root.EventEmitter);

    // Export `FileChooser`.
    return (root.FileChooser = FileChooser);

}(this));
