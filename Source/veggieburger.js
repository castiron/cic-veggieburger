var Veggieburger;

Veggieburger = (function() {
  var settings;

  settings = {
    toggle: '[data-toggle]',
    toggledClass: 'open',
    touch: false
  };

  function Veggieburger(el, options) {
    this.$el = $(el);
    this.settings = $.extend(settings, options);
    this.toggle = $(settings.toggle);
    this.toggledClass = settings.toggledClass;
    this.toggleable = [this.$el, this.toggle];
    console.log(settings);
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
    return this.toggle.click((function(_this) {
      return function() {
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
        if (_this.outHide(e)) {
          return _this.toggleAll();
        }
      };
    })(this));
    if (settings.touch === true) {
      this.$el.swipe("enable");
      return this.$el.swipe({
        swipeLeft: (function(_this) {
          return function(event, direction) {
            return _this.toggleAll();
          };
        })(this)
      });
    }
  };

  Veggieburger.prototype.unbindClose = function() {
    $('body').unbind();
    if (settings.touch === true) {
      return this.$el.swipe("disable");
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
