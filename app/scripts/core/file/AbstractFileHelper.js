(function (root) {
    'use strict';

    var AbstractFileHelper = function () {

    };

    AbstractFileHelper.prototype.initialize = function () {
        this.createInput();
        this.render();
    };

    AbstractFileHelper.prototype.render = function () {
        this.$placeHolder.appendChild(this.$input);
    };

    AbstractFileHelper.prototype.remove = function () {
        this.$input.parentNode.removeChild(this.$input);
    };

    AbstractFileHelper.EVENTS = {
        LOAD_FILES: 'load:files',
        SAVE_FILE: 'save:file'
    };

    // Extend `AbstractFileHelper` module with events.
    _.extend(AbstractFileHelper.prototype, root.EventEmitter);

    // Exports `AbstractFileHelper`.
    return (root.AbstractFileHelper = AbstractFileHelper);
}(this));
