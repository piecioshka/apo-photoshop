(function (root) {
    'use strict';

    // Aliases.
    var doc = root.document;

    var AbstractWindow = function () {
        return this;
    };

    AbstractWindow.prototype.setup = function () {
        this.id = _.uniqueId('window-');

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

        this.$window.addEventListener('click', function () {
            // Activate window if is not.
            if (!self.isActive) {
                root.App.windowManager.emit(AbstractWindow.EVENTS.ACTIVE_WINDOW, { win: self });
            }
        }, false);
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
            root.App.windowManager.emit(AbstractWindow.EVENTS.CLOSE_WINDOW, { win: self });
        });

        return this.$buttons;
    };

    AbstractWindow.prototype.createContent = function () {
        this.$content = doc.createElement('div');
        this.$content.classList.add('abstract-window-content');
        this.$window.appendChild(this.$content);
    };

    AbstractWindow.prototype.appendContent = function (item) {
        if (_.isString(item)) {
            this.$content.innerHTML += item;
        } else {
            this.$content.appendChild(item);
        }
    };

    AbstractWindow.prototype.removeContent = function (item) {
        root.Utilities.walkTheDOM(this.$content, function (node) {
            if (node === item) {
                item.parentNode.removeChild(item);
            }
        });
    };

    AbstractWindow.prototype.updateTitle = function (name) {
        var self = this;
        var DOTS_WIDTH = 15;
        var BUTTONS_MARGIN = 10;

        this.$title.innerText = name;
        this.$title.classList.add('sky-hide');

        // As quickly as engine can render.
        setTimeout(function () {
            var diff = self.$bar.offsetWidth - self.$buttons.offsetWidth - BUTTONS_MARGIN;

            if (diff < self.$title.offsetWidth) {
                self.$title.style.width = (diff - DOTS_WIDTH) + 'px';
            }

            self.$title.classList.remove('sky-hide');
        }, 0);
    };

    AbstractWindow.prototype.getTitle = function () {
        return this.$title.innerText;
    };

    AbstractWindow.prototype.render = function () {
        var self = this;
        this.$placeHolder.appendChild(this.$window);

        // Warning! Container must exists in DOM.
        root.MoveMaster({
            object: this.$window,
            parent: this.$placeHolder,
            hook: this.$bar
        });

        setTimeout(function () {
            self.emit(AbstractWindow.EVENTS.RENDER_WINDOW);
        }, 0);
    };

    AbstractWindow.prototype.remove = function () {
        // Remove from DOM.
        this.$window.parentNode.removeChild(this.$window);
        // Clear all properties.
        // this.$window = this.$placeHolder = this.$bar = this.$buttons = this.$title = this.$content = null;
        // Remove all listeners.
        this.off();
    };

    AbstractWindow.prototype.setRigidWidth = function () {
        var st = root.getComputedStyle(this.$window, null);
        var width = parseFloat(st.getPropertyValue('width')) || 0;
        width = Math.ceil(width);
        this.$window.style.width = width + 'px';
    };

    AbstractWindow.EVENTS = {
        INACTIVE_WINDOW: 'window:inactive',
        ACTIVE_WINDOW: 'window:active',
        CLOSE_WINDOW: 'window:close',
        RENDER_WINDOW: 'window:render',
        READY: 'window:ready'
    };

    // Extend `AbstractWindow` module with events.
    _.extend(AbstractWindow.prototype, root.EventEmitter);

    // Export `AbstractWindow`.
    return (root.AbstractWindow = AbstractWindow);

}(this));
