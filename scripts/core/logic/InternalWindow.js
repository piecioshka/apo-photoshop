(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var InternalWindow = function (params) {
        var self = this;

        this.settings = params;

        this.placeHolder = doc.querySelector(this.settings.renderAreaID);

        this.$window = null;
        this.$bar = null;
        this.$buttons = null;
        this.$title = null;
        this.$content = null;

        this.on(InternalWindow.EVENTS.ACTIVE_WINDOW, function () {
            self.$window.classList.add('active');
        });

        this.on(InternalWindow.EVENTS.INACTIVE_WINDOW, function () {
            self.$window.classList.remove('active');
        });

        this.initialize();
    };

    InternalWindow.prototype.initialize = function () {
        this.createWindow();
        this.createTopBar();
        this.createContent();
    };

    InternalWindow.prototype.createWindow = function () {
        var self = this;
        this.$window = doc.createElement('div');
        this.$window.classList.add('internal-window');
        this.$window.classList.add('internal-window');

        this.$window.addEventListener('click', function () {
            self.emit(InternalWindow.EVENTS.ACTIVE_WINDOW);
        }, false);

        if (root.Utilities.isDarwin()) {
            this.$window.classList.add('macosx');
        }
    };

    InternalWindow.prototype.createTopBar = function () {
        this.$bar = doc.createElement('nav');
        this.$bar.classList.add('internal-window-bar');

        this.$bar.appendChild(this.createTopBarTitle());
        this.$bar.appendChild(this.createTopBarButtons());

        this.$window.appendChild(this.$bar);
    };

    InternalWindow.prototype.createTopBarTitle = function () {
        this.$title = doc.createElement('h4');
        this.$title.classList.add('internal-window-title');
        return this.$title;
    };

    InternalWindow.prototype.createTopBarButtons = function () {
        var self = this;

        this.$buttons = doc.createElement('div');
        this.$buttons.classList.add('internal-window-buttons');

        var maxButton = doc.createElement('a');
        maxButton.classList.add('internal-window-button');
        maxButton.classList.add('internal-window-button-max');
        this.$buttons.appendChild(maxButton);

        var minButton = doc.createElement('a');
        minButton.classList.add('internal-window-button');
        minButton.classList.add('internal-window-button-min');
        this.$buttons.appendChild(minButton);

        var closeButton = doc.createElement('a');
        closeButton.classList.add('internal-window-button');
        closeButton.classList.add('internal-window-button-close');
        this.$buttons.appendChild(closeButton);

        closeButton.addEventListener('click', function (evt) {
            evt.preventDefault();
            self.remove();
            self.emit(InternalWindow.EVENTS.CLOSE_WINDOW);
        });

        return this.$buttons;
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

    InternalWindow.prototype.updateTitle = function (name) {
        var self = this;
        var DOTS_WIDTH = 15;
        this.$title.innerText = name;
        this.$title.classList.add('sky-hide');

        // As quickly as render engine could.
        root.setTimeout(function () {
            var diff = self.$bar.offsetWidth - self.$buttons.offsetWidth;

            if (diff < self.$title.offsetWidth) {
                self.$title.style.width = (diff - DOTS_WIDTH) + 'px';
            }

            self.$title.classList.remove('sky-hide');
        }, 0);
    };

    InternalWindow.prototype.render = function () {
        this.placeHolder.appendChild(this.$window);

        // Warning! Container which is rendered in DOM.
        new root.MoveMaster({
            object: this.$window,
            reference: this.$bar,
            parent: this.placeHolder
        });
    };

    InternalWindow.prototype.remove = function () {
        this.$window.parentNode.removeChild(this.$window);
    };

    InternalWindow.EVENTS = {
        INACTIVE_WINDOW: 'inactive',
        ACTIVE_WINDOW: 'active',
        CLOSE_WINDOW: 'close'
    };

    // Extend `InternalWindow` module with events.
    _.extend(InternalWindow.prototype, EventEmitter);

    // Export `InternalWindow`.
    return (root.InternalWindow = InternalWindow);

}(this));
