var Veggieburger;

Veggieburger = (function() {
  var settings;

  settings = {
    toggle: '[data-toggle]',
    toggledClass: 'open',
    closer: null,
    preventDefault: true,
    outside: false,
    touch: false
  };

  function Veggieburger(el, options) {
    this.$el = $(el);
    this.settings = $.extend(settings, options);
    this.toggle = $(settings.toggle);
    this.toggledClass = settings.toggledClass;
    this.closer = settings.closer !== null ? settings.closer : void 0;
    this.prevent = settings.preventDefault;
    this.outside = settings.outside;
    this.toggleable = [this.$el, this.toggle];
    this.bindToggle();
  }

  Veggieburger.prototype.toggleAll = function() {
    var t, toggled, _i, _len, _ref;
    toggled = false;
    _ref = this.toggleable;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      t.toggleClass(this.toggledClass);
      if (t.hasClass(this.toggledClass)) {
        toggled = true;
      }
    }
    if (toggled) {
      return this.bindClose();
    } else {
      return this.unbindClose();
    }
  };

  Veggieburger.prototype.bindToggle = function() {
    return this.$el.click((function(_this) {
      return function(event) {
        if (_this.prevent) {
          event.preventDefault();
        }
        return _this.toggleAll();
      };
    })(this));
  };

  Veggieburger.prototype.outHide = function(e) {
    var hit, t, _i, _len, _ref;
    hit = true;
    _ref = this.toggleable;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if ($(e.target).closest(t).length) {
        hit = false;
      }
    }
    return hit;
  };

  Veggieburger.prototype.bindClose = function() {
    $('body').bind("mouseup touchend", (function(_this) {
      return function(e) {
        if (_this.outside && _this.outHide(e)) {
          return _this.toggleAll();
        }
      };
    })(this));
    if (settings.touch === true) {
      this.$el.swipe("enable");
      this.$el.swipe({
        swipeLeft: (function(_this) {
          return function(event, direction) {
            return _this.toggleAll();
          };
        })(this)
      });
    }
    if (this.closer !== null) {
      return this.closer.bind("click", (function(_this) {
        return function(e) {
          if (_this.prevent) {
            event.preventDefault();
          }
          return _this.toggleAll();
        };
      })(this));
    }
  };

  Veggieburger.prototype.unbindClose = function() {
    $('body').unbind();
    if (settings.touch === true) {
      this.$el.swipe("disable");
    }
    if (this.closer !== null) {
      return this.closer.unbind();
    }
  };

  return Veggieburger;

})();

$.fn.extend({
  veggieburger: function(options) {
    return this.each(function() {
      return new Veggieburger(this, options);
    });
  }
});
