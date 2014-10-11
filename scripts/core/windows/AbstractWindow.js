(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var AbstractWindow = function () {
        return this;
    };

    AbstractWindow.prototype.setup = function () {
        this.createWindow();
        this.createTopBar();
        this.createContent();
        this.listenOnActivationEvents();
    };

    AbstractWindow.prototype.listenOnActivationEvents = function () {
        var self = this;
        this.on(AbstractWindow.EVENTS.ACTIVE_WINDOW, function () {
            self.isActive = true;
            self.$window.classList.add('active');
        });

        this.on(AbstractWindow.EVENTS.INACTIVE_WINDOW, function () {
            self.isActive = false;
            self.$window.classList.remove('active');
        });
    };

    AbstractWindow.prototype.createWindow = function () {
        var self = this;
        this.$window = doc.createElement('div');
        this.$window.classList.add('abstract-window');
        this.$window.classList.add('abstract-window');

        this.$window.addEventListener('click', function () {
            self.emit(AbstractWindow.EVENTS.ACTIVE_WINDOW);
        }, false);

        if (root.Utilities.isDarwin()) {
            this.$window.classList.add('macosx');
        }
    };

    AbstractWindow.prototype.createTopBar = function () {
        this.$bar = doc.createElement('nav');
        this.$bar.classList.add('abstract-window-bar');

        this.$bar.appendChild(this.createTopBarTitle());
        this.$bar.appendChild(this.createTopBarButtons());

        this.$window.appendChild(this.$bar);
    };

    AbstractWindow.prototype.createTopBarTitle = function () {
        this.$title = doc.createElement('h4');
        this.$title.classList.add('abstract-window-title');
        return this.$title;
    };

    AbstractWindow.prototype.createTopBarButtons = function () {
        var self = this;

        this.$buttons = doc.createElement('div');
        this.$buttons.classList.add('abstract-window-buttons');

        var maxButton = doc.createElement('a');
        maxButton.classList.add('abstract-window-button');
        maxButton.classList.add('abstract-window-button-max');
        // Hide unsupported button.
        // this.$buttons.appendChild(maxButton);

        var minButton = doc.createElement('a');
        minButton.classList.add('abstract-window-button');
        minButton.classList.add('abstract-window-button-min');
        // Hide unsupported button.
        // this.$buttons.appendChild(minButton);

        var closeButton = doc.createElement('a');
        closeButton.classList.add('abstract-window-button');
        closeButton.classList.add('abstract-window-button-close');
        this.$buttons.appendChild(closeButton);

        closeButton.addEventListener('click', function (evt) {
            evt.preventDefault();
            self.close();
        });

        return this.$buttons;
    };

    AbstractWindow.prototype.createContent = function () {
        this.$content = doc.createElement('div');
        this.$content.classList.add('abstract-window-content');
        this.$window.appendChild(this.$content);
    };

    AbstractWindow.prototype.setContent = function (item) {
        if (this.$content.firstChild === null) {
            this.$content.appendChild(item);
        }
    };

    AbstractWindow.prototype.updateTitle = function (name) {
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

    AbstractWindow.prototype.render = function () {
        var self = this;
        this.$placeHolder.appendChild(this.$window);

        // Warning! Container which is rendered in DOM.
        new root.MoveMaster({
            object: this.$window,
            parent: this.$placeHolder,
            reference: this.$bar
        });

        setTimeout(function () {
            self.emit(AbstractWindow.EVENTS.RENDER_WINDOW);
        }, 0);
    };

    AbstractWindow.prototype.remove = function () {
        this.$window.parentNode.removeChild(this.$window);
    };

    AbstractWindow.prototype.close = function () {
        this.remove();
        this.emit(AbstractWindow.EVENTS.CLOSE_WINDOW, {
            window: this
        });
    };

    AbstractWindow.EVENTS = {
        INACTIVE_WINDOW: 'inactive',
        ACTIVE_WINDOW: 'active',
        CLOSE_WINDOW: 'close',
        RENDER_WINDOW: 'render'
    };

    // Extend `AbstractWindow` module with events.
    _.extend(AbstractWindow.prototype, EventEmitter);

    // Export `AbstractWindow`.
    return (root.AbstractWindow = AbstractWindow);

}(this));
