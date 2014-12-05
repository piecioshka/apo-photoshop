(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var MultipleFileChooser = function (params) {
        this.settings = {
            place: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(this.settings.place);
        this.$input = null;

        this.initialize();
    };

    MultipleFileChooser.prototype.initialize = function () {
        this.createInput();
        this.render();
    };

    MultipleFileChooser.prototype.createInput = function () {
        var self = this;

        this.$input = doc.createElement('input');
        this.$input.setAttribute('type', 'file');
        this.$input.setAttribute('multiple', 'multiple');
        this.$input.classList.add('hide');
        this.$input.addEventListener('change', function () {
            var files = [];

            _.each(self.$input.files, function (image) {
                files.push({
                    file: image.path,
                    name: image.name
                });
            });

            self.emit(MultipleFileChooser.EVENTS.LOAD_FILES, files);
            self.remove();
        });
        this.$input.click();
    };

    MultipleFileChooser.prototype.render = function () {
        this.$placeHolder.appendChild(this.$input);
    };

    MultipleFileChooser.prototype.remove = function () {
        this.$input.parentNode.removeChild(this.$input);
    };

    MultipleFileChooser.EVENTS = {
        LOAD_FILES: 'load:files'
    };

    // Extend `MultipleFileChooser` module with events.
    _.extend(MultipleFileChooser.prototype, root.EventEmitter);

    // Export `MultipleFileChooser`.
    return (root.MultipleFileChooser = MultipleFileChooser);

}(this));
