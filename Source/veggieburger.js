var Veggieburger;

Veggieburger = (function() {
  var settings;

  settings = {
    toggle: '[data-toggle]',
    toggledClass: 'open',
    closedClass: null,
    closer: null,
    preventDefault: true,
    outside: false,
    touch: false
  };

  function Veggieburger(el, options) {
    var t, _i, _len, _ref;
    this.$el = $(el);
    this.settings = $.extend(settings, options);
    this.toggle = this.multiToggle(settings.toggle);
    this.toggledClass = settings.toggledClass;
    this.closedClass = settings.closedClass !== null ? settings.closedClass : null;
    this.closer = settings.closer !== null ? $(settings.closer) : null;
    this.prevent = settings.preventDefault;
    this.outside = settings.outside;
    this.toggleable = [this.$el];
    _ref = this.toggle;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      this.toggleable.push(t);
    }
    console.log(this.toggleable);
    this.bindToggle();
  }

  Veggieburger.prototype.multiToggle = function(setting) {
    var result, s, _i, _len;
    result = [];
    if (Object.prototype.toString.call(setting) === '[object Array]') {
      for (_i = 0, _len = setting.length; _i < _len; _i++) {
        s = setting[_i];
        result.push($(s));
      }
      return result;
    } else {
      result.push($(setting));
      return result;
    }
  };

  Veggieburger.prototype.toggleAll = function() {
    var t, toggled, _i, _j, _len, _len1, _ref, _ref1, _results;
    toggled = false;
    _ref = this.toggleable;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if (t.hasClass(this.closedClass)) {
        t.toggleClass(this.closedClass);
      }
      t.toggleClass(this.toggledClass);
      if (t.hasClass(this.toggledClass)) {
        toggled = true;
      }
    }
    if (toggled) {
      return this.bindClose();
    } else {
      this.unbindClose();
      if (this.closedClass !== null) {
        _ref1 = this.toggleable;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          t = _ref1[_j];
          _results.push(t.toggleClass(this.closedClass));
        }
        return _results;
      }
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
