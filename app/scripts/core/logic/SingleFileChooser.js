(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var SingleFileChooser = function (params) {
        this.settings = {
            place: null
        };
        _.extend(this.settings, params);

        this.$placeHolder = doc.querySelector(this.settings.place);
        this.$input = null;

        this.initialize();
    };

    SingleFileChooser.prototype.initialize = function () {
        this.createInput();
        this.render();
    };

    SingleFileChooser.prototype.createInput = function () {
        var self = this;

        this.$input = doc.createElement('input');
        this.$input.setAttribute('type', 'file');
        this.$input.classList.add('hide');
        this.$input.addEventListener('change', function () {
            var image = self.$input.files[0];
            self.emit(SingleFileChooser.EVENTS.SELECT_FILE, {
                file: image.path,
                name: image.name
            });
            self.remove();
        });
        this.$input.click();
    };

    SingleFileChooser.prototype.render = function () {
        this.$placeHolder.appendChild(this.$input);
    };

    SingleFileChooser.prototype.remove = function () {
        this.$input.parentNode.removeChild(this.$input);
    };

    SingleFileChooser.EVENTS = {
        SELECT_FILE: 'file:single:select'
    };

    // Extend `SingleFileChooser` module with events.
    _.extend(SingleFileChooser.prototype, root.EventEmitter);

    // Export `SingleFileChooser`.
    return (root.SingleFileChooser = SingleFileChooser);

}(this));
