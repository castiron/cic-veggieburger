var Veggieburger,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Veggieburger = (function() {
  Veggieburger.prototype.defaultSettings = function() {
    return {
      triggers: null,
      hash: null,
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
    this.keyClose = bind(this.keyClose, this);
    var hashKey;
    this.util = {
      snakeToCamel: function(string) {
        return string.replace(/(\-\w)/g, function(m) {
          return m[1].toUpperCase();
        });
      }
    };
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
    if (this.settings.hash) {
      hashKey = this.util.snakeToCamel(this.settings.hash.substring(6, this.settings.hash.length - 1));
      this.hash = $(this.settings.hash).data(hashKey);
    } else {
      this.hash = null;
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
    this.maybeToggleOnLoad();
    this.bindToggle();
  }

  Veggieburger.prototype.multiSet = function(setting) {
    var i, len, result, s;
    result = [];
    if (Object.prototype.toString.call(setting) === '[object Array]') {
      for (i = 0, len = setting.length; i < len; i++) {
        s = setting[i];
        result.push(this.$el.find(s));
      }
      return result;
    } else {
      result.push(this.$el.find(setting));
    }
    return result;
  };

  Veggieburger.prototype.toggleAll = function() {
    var i, j, k, len, len1, len2, ref, ref1, ref2, results, t, th, toggled;
    toggled = false;
    ref = this.toggleable;
    for (i = 0, len = ref.length; i < len; i++) {
      t = ref[i];
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
        ref1 = this.toggleable;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          t = ref1[j];
          t.toggleClass(this.closedClass);
        }
      }
    }
    if (this.transitionHeight) {
      ref2 = this.transitionHeight;
      results = [];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        th = ref2[k];
        if (th.hasClass(this.toggledClass)) {
          results.push(this.transitionOpenHeight(th));
        } else {
          results.push(this.transitionCloseHeight(th));
        }
      }
      return results;
    }
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

  Veggieburger.prototype.maybeToggleOnLoad = function() {
    if (this.hash) {
      if (~location.hash.toLowerCase().indexOf(this.hash)) {
        return this.toggleAll();
      }
    }
  };

  Veggieburger.prototype.bindToggle = function() {
    var i, len, ref, results, t;
    ref = this.triggers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      t = ref[i];
      results.push(t.click((function(_this) {
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
    return results;
  };

  Veggieburger.prototype.outHide = function(e) {
    var hit, i, j, len, len1, o, ref, ref1, t;
    hit = true;
    if (typeof this.outside !== 'boolean' && this.outside) {
      ref = this.outside;
      for (i = 0, len = ref.length; i < len; i++) {
        o = ref[i];
        if ($(e.target).closest(o).length) {
          hit = false;
        }
      }
    }
    if (typeof this.outside === 'boolean' && this.outside) {
      ref1 = this.toggleable;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        t = ref1[j];
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
    var c, i, len, ref;
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
      ref = this.closers;
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
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
    var c, i, len, ref;
    $('body').unbind();
    if (this.settings.touch === true) {
      this.$el.swipe("disable");
    }
    if (this.closers !== null) {
      ref = this.closers;
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
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
