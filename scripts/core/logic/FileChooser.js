(function (root) {
    'use strict';

    var FileChooser = function (params) {
        this.settings = params;

        this.$el = document.querySelector(this.settings.place);
        this.$input = null;

        this.initialize();
    };

    FileChooser.prototype.initialize = function () {
        this.createInput();
        this.render();
    };

    FileChooser.prototype.createInput = function () {
        var self = this;

        this.$input = document.createElement('input');
        this.$input.setAttribute('type', 'file');
        this.$input.classList.add('hide');
        this.$input.addEventListener('change', function () {
            self.emit(FileChooser.EVENTS.SELECT_FILE, {
                file: self.$input.files[0].path
            });
            self.$input.parentNode.removeChild(self.$input);
        });
        this.$input.click();
    };

    FileChooser.prototype.render = function () {
        this.$el.appendChild(this.$input);
    };

    FileChooser.EVENTS = {
        SELECT_FILE: 'fileChooser:select'
    };

    // Extend `FileChooser` module with events.
    _.extend(FileChooser.prototype, root.EventEmitter);

    // Export `FileChooser`.
    return (root.FileChooser = FileChooser);

}(this));
