var Veggieburger,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Veggieburger = (function() {
  Veggieburger.prototype.defaultSettings = function() {
    return {
      triggers: null,
      toggle: '[data-toggle]',
      toggledClass: 'open',
      closedClass: null,
      closers: null,
      closeKeys: null,
      transitionHeight: null,
      transitionSpeed: 200,
      preventDefault: true,
      outside: false,
      touch: false,
      onToggleOn: function() {},
      onToggleOff: function() {}
    };
  };

  function Veggieburger(el, options) {
    this.keyClose = __bind(this.keyClose, this);
    this.$el = $(el);
    this.settings = $.extend(this.defaultSettings(), options);
    this.triggers = this.settings.triggers !== null ? this.multiSet(this.settings.triggers) : [$(this.$el.find(':button')[0])];
    this.transitionHeight = this.settings.transitionHeight !== null ? this.multiSet(this.settings.transitionHeight) : null;
    this.toggleable = this.multiSet(this.settings.toggle);
    this.toggleable = this.toggleable.concat(this.triggers);
    this.transitionSpeed = this.settings.transitionSpeed;
    if (this.transitionHeight !== null) {
      this.toggleable = this.toggleable.concat(this.transitionHeight);
    }
    this.closers = this.settings.closers !== null ? this.multiSet(this.settings.closers) : null;
    this.toggledClass = this.settings.toggledClass;
    this.closedClass = this.settings.closedClass !== null ? this.settings.closedClass : null;
    this.prevent = this.settings.preventDefault;
    this.outside = typeof this.settings.outside !== 'boolean' ? this.multiSet(this.settings.outside) : this.settings.outside;
    this.onToggleOn = typeof this.settings.onToggleOn === 'function' ? this.settings.onToggleOn : function() {};
    this.onToggleOff = typeof this.settings.onToggleOff === 'function' ? this.settings.onToggleOff : function() {};
    if (this.settings.closeKeys !== null) {
      if ((Number(this.settings.closeKeys) === this.settings.closeKeys && this.settings.closeKeys % 1 === 0) && Object.prototype.toString.call(this.settings.closeKeys) !== '[object Array]') {
        this.closeKeys = [this.settings.closeKeys];
      } else if (Object.prototype.toString.call(this.settings.closeKeys) === '[object Array]') {
        this.closeKeys = this.settings.closeKeys;
      } else {
        this.closeKeys = null;
      }
    } else {
      this.closeKeys = null;
    }
    this.bindToggle();
  }

  Veggieburger.prototype.multiSet = function(setting) {
    var result, s, _i, _len;
    result = [];
    if (Object.prototype.toString.call(setting) === '[object Array]') {
      for (_i = 0, _len = setting.length; _i < _len; _i++) {
        s = setting[_i];
        result.push(this.$el.find(s));
      }
      return result;
    } else {
      result.push(this.$el.find(setting));
    }
    return result;
  };

  Veggieburger.prototype.toggleAll = function() {
    var t, th, toggled, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
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
      this.onToggleOn.call(this.$el);
      this.bindClose();
    } else {
      this.onToggleOff.call(this.$el);
      this.unbindClose();
      if (this.closedClass !== null) {
        _ref1 = this.toggleable;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          t = _ref1[_j];
          t.toggleClass(this.closedClass);
        }
      }
    }
    _ref2 = this.transitionHeight;
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      th = _ref2[_k];
      if (th.hasClass(this.toggledClass)) {
        _results.push(this.transitionOpenHeight(th));
      } else {
        _results.push(this.transitionCloseHeight(th));
      }
    }
    return _results;
  };

  Veggieburger.prototype.transitionOpenHeight = function(element) {
    var $openHeight;
    element.css({
      display: 'inherit',
      height: 'auto'
    });
    $openHeight = element.outerHeight();
    element.css('height', 0);
    return element.animate({
      height: $openHeight
    }, this.transitionSpeed, function() {
      return element.css('height', 'auto');
    });
  };

  Veggieburger.prototype.transitionCloseHeight = function(element) {
    return element.animate({
      height: 0
    }, this.transitionSpeed);
  };

  Veggieburger.prototype.bindToggle = function() {
    var t, _i, _len, _ref, _results;
    _ref = this.triggers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      _results.push(t.click((function(_this) {
        return function(event) {
          if (_this.prevent) {
            if (event.preventDefault) {
              event.preventDefault();
            } else {
              event.returnValue = false;
            }
          }
          return _this.toggleAll();
        };
      })(this)));
    }
    return _results;
  };

  Veggieburger.prototype.outHide = function(e) {
    var hit, o, t, _i, _j, _len, _len1, _ref, _ref1;
    hit = true;
    if (typeof this.outside !== 'boolean' && this.outside) {
      _ref = this.outside;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        if ($(e.target).closest(o).length) {
          hit = false;
        }
      }
    }
    if (typeof this.outside === 'boolean' && this.outside) {
      _ref1 = this.toggleable;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        t = _ref1[_j];
        if ($(e.target).closest(t).length) {
          hit = false;
        }
      }
    }
    return hit;
  };

  Veggieburger.prototype.keyClose = function(e) {
    if ($.inArray(e.keyCode, this.closeKeys) !== -1) {
      return this.toggleAll();
    }
  };

  Veggieburger.prototype.bindClose = function() {
    var c, _i, _len, _ref;
    $('body').bind("mouseup touchend", (function(_this) {
      return function(e) {
        if (_this.outside && _this.outHide(e)) {
          return _this.toggleAll();
        }
      };
    })(this));
    if (this.settings.touch === true) {
      this.$el.swipe("enable");
      this.$el.swipe({
        swipeLeft: (function(_this) {
          return function(event, direction) {
            return _this.toggleAll();
          };
        })(this)
      });
    }
    if (this.closers !== null) {
      _ref = this.closers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        c.bind("click", (function(_this) {
          return function(event) {
            if (_this.prevent) {
              if (event.preventDefault) {
                event.preventDefault();
              } else {
                event.returnValue = false;
              }
            }
            return _this.toggleAll();
          };
        })(this));
      }
    }
    if (this.closeKeys !== null) {
      return $(document).keyup(this.keyClose);
    }
  };

  Veggieburger.prototype.unbindClose = function() {
    var c, _i, _len, _ref;
    $('body').unbind();
    if (this.settings.touch === true) {
      this.$el.swipe("disable");
    }
    if (this.closers !== null) {
      _ref = this.closers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        c.unbind();
      }
    }
    if (this.closeKeys !== null) {
      return $(document).unbind("keyup", this.keyClose);
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
