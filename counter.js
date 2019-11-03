var jQuery = require('jquery');
var toStyle = require('to-style').string;
(function() {

  (function($) {
    var Counter, defaults, pluginName;
    pluginName = "counter";
    defaults = {
      autoStart: true,
      duration: 1500,
      countFrom: void 0,
      countTo: void 0,
      runOnce: false,
      placeholder: void 0,
      easing: "easeOutQuad",
      onStart: function() {},
      onComplete: function() {},
      numberFormatter: function(number) {
        return Math.round(number);
      }
    };
    Counter = (function() {

      function Counter(element, options) {
        this.element = element;
        this.options = $.extend(true, {}, defaults, options);
        this.init();
      }

      return Counter;

    })();
    Counter.prototype.init = function() {
      if (this.options.countFrom === null || isNaN(this.options.countFrom)) {
        var givenNumber;
        givenNumber = parseInt(this.element.innerHTML);
        if ((givenNumber != null) && !isNaN(givenNumber)) {
          if (this.options.countFrom < givenNumber) {
            this.options.countTo = givenNumber;
          } else {
            this.options.countFrom = givenNumber;
          }
        }
      }
      if (this.options.countFrom === void 0) {
        this.options.countFrom = 0;
      }
      if (this.options.countTo === void 0) {
        this.options.countTo = 0;
      }
      if (this.options.placeholder != null) {
        this.element.innerHTML = this.options.placeholder;
      }
      if (this.options.autoStart) {
        return this.start();
      }
    };
    Counter.prototype.restart = function (options) {
      this.options.countFrom = this.options.countTo;
      this.options = $.extend(true, {}, this.options, options);
      return new Counter(this.element, this.options);
    },
    Counter.prototype.start = function() {
      var self;
      if (this.options.runOnce && this.runCount() >= 1) {
        return false;
      }
      if (!this.running) {
        this.running = true;
        this.updateRunCount();
        this.options.onStart();
        self = this;
        return jQuery({
          count: this.options.sameDataFlip && this.options.countFrom === this.options.countTo ? 0 : this.options.countFrom
        }).animate({
          count: this.options.countTo
        }, {
          duration: this.options.duration,
          easing: this.options.easing,
          step: function() {
            const str = self.setNumber(this.count);
            self.options.onSetNumberComplete && self.options.onSetNumberComplete();
            return str;
          },
          complete: function() {
            self.setNumber(self.options.countTo);
            self.options.onSetNumberComplete && self.options.onSetNumberComplete();
            self.running = false;
            return self.options.onComplete();
          }
        });
      }
    };
    Counter.prototype.updateRunCount = function() {
      return $(this.element).data("counterRunCount", (this.runCount() || 0) + 1);
    };
    Counter.prototype.runCount = function() {
      return $(this.element).data("counterRunCount");
    };
    Counter.prototype.setNumber = function(number) {
      return this.element.innerHTML = this.options.numberFormatter.call(this, number);
    };
    Counter.prototype.format = function (num, c) {
      num = num.toString();
      if (num.length === c) {
        return num;
      }
      if (num.length < c) {
        var arr = [];
        for (var i=0; i<c; i++) {
          arr.push(0);
        }
        var str = arr.join('');
        str = str.concat(num);
        return str.slice(-c, str.length);
      }
    };
    Counter.prototype.createSpan = function (source, classname) {
      return '<span class="' + classname + '" style="'
      + toStyle(source) +'">' + source.content + '</span>';
    };
    return $.fn.counter = function(options) {
      var self;
      self = this;
      return this.each(function() {
        var plugin;
        if (plugin = $(this).data("plugin_" + pluginName)) {
          if (typeof options === "string") {
            switch (options) {
              case "start":
                return plugin.start();
            }
          } else {
            plugin.restart(options);
          }
        } else {
          return $(this).data("plugin_" + pluginName, new Counter(this, options));
        }
      });
    };
  })(jQuery);

}).call(this);

module.exports = jQuery;
