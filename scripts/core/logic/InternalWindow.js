(function (root) {
    'use strict';

    var doc = root.document;

    var InternalWindow = function (params) {
        this.settings = params;

        this.placeHolder = doc.querySelector(this.settings.renderAreaID);
        this.$window = doc.createElement('div');
        this.$window.setAttribute('draggable', 'false');

        this.$window.classList.add('internal-window');

        if (root.Utilities.isDarwin()) {
            this.$window.classList.add('macosx');
        }

        this.$bar = null;
        this.$content = null;

        this.initialize();
    };

    InternalWindow.prototype.initialize = function () {
        this.createTopBar();
        this.createContent();

        new root.MoveMaster(this.$bar, this.placeHolder);
    };

    InternalWindow.prototype.createTopBar = function () {
        this.$bar = doc.createElement('nav');
        this.$bar.classList.add('internal-window-bar');

        this.$bar.appendChild(this.createTopBarTitle());
        this.$bar.appendChild(this.createTopBarButtons());

        this.$window.appendChild(this.$bar);
    };

    InternalWindow.prototype.createTopBarTitle = function () {
        var title = doc.createElement('h4');
        title.classList.add('internal-window-title');
        title.innerText = 'Nazwa okna';
        return title;
    };

    InternalWindow.prototype.createTopBarButtons = function () {
        var self = this;

        var buttons = doc.createElement('div');
        buttons.classList.add('internal-window-buttons');

        var maxButton = doc.createElement('a');
        maxButton.classList.add('internal-window-button');
        maxButton.classList.add('internal-window-button-max');
        buttons.appendChild(maxButton);

        var minButton = doc.createElement('a');
        minButton.classList.add('internal-window-button');
        minButton.classList.add('internal-window-button-min');
        buttons.appendChild(minButton);

        var closeButton = doc.createElement('a');
        closeButton.classList.add('internal-window-button');
        closeButton.classList.add('internal-window-button-close');
        buttons.appendChild(closeButton);

        closeButton.addEventListener('click', function (evt) {
            evt.preventDefault();
            self.remove();
            self.emit(InternalWindow.EVENTS.CLOSE_WINDOW);
        });

        return buttons;
    };

    InternalWindow.prototype.createContent = function () {
        this.$content = doc.createElement('div');
        this.$content.classList.add('internal-window-content');

        this.$window.appendChild(this.$content);
    };

    InternalWindow.prototype.setContent = function (item) {
        if (this.$content.firstChild === null) {
            this.$content.appendChild(item);
        }
    };

    InternalWindow.prototype.render = function () {
        this.placeHolder.appendChild(this.$window);
    };

    InternalWindow.prototype.remove = function () {
        this.$window.parentNode.removeChild(this.$window);
    };

    InternalWindow.EVENTS = {
        CLOSE_WINDOW: 'internalWindow:close'
    };

    // Extend `InternalWindow` module with events.
    _.extend(InternalWindow.prototype, EventEmitter);

    // Export `InternalWindow`.
    return (root.InternalWindow = InternalWindow);

}(this));
