var Event = require('bcore/event');
var $ = require('jquery');
var toStyle = require('to-style').string;
require('./jquery.easing.js');
require('./counter');
var _ = require('lodash');

module.exports = Event.extend(function Com(container, config){
  this.config = {
    duration : 1000,
    digit: null,
    prefix : {
      'content': '',
      'font-size' : 56,
      'color': '#ededed',
      'font-weight': 'normal',
      'vertical-align': 'super'
    },
    'separating-chart': false,
    suffix : {
      'content': '',
      'font-size' : 56,
      'color': '#ededed',
      'font-weight': 'normal',
      'vertical-align': 'super'
    },
    rounding: true,
    decimal: 2,
    separate : false,
    'color' : '#fff',
    'num-background-color' : '#000',
    'background-color' : '#000',
    'font-size' : 56,
    'font-weight': 'normal',
    'display': 'inline-block',
    'text-indent': '0.02em',
    'letter-spacing': '0.02em',
    'height': '0.9em',
    'line-height': '1em',
    'margin-right': '.2em',
    'border-radius': 6,
    'separating-background': false,
    'inner-style' : {
      'text-align' : 'center'
    },
    'separatingSymbol': ',',
    'decimalSymbol': '.',
    'sameDataFlip': false
  }
  $.extend(true, this.config, config);
  this.container = $(container);
  this.apis = config.apis;
  this._data = 0;
  this.reset();
}, {
  createArr : function (value, len) {
    return _.fill(Array(len), value).join('');
  },
  update : function (data) {
    var self = this;
    var config = this.config;
    this.container.counter({
      sameDataFlip: config.sameDataFlip,
      autoStart: true,
      duration: config.duration,
      countFrom: this._data,
      countTo: data,
      placeholder: 0,
      easing: "easeOutCubic",
      prefix: config.prefix || '',
      suffix: config.suffix || '',
      separate: config.separate || false,
      numberFormatter : function (number) {
        var opt = config;
        if (!_.isNumber(number) || number === 0) {
          // return opt.prefix.content + '0' + opt.suffix.content;
          number = 0;
        }
        number = config.rounding ? Math.round(number) : number;
        var arr;

        var decimalArr = config.decimalSymbol.split('')
        if (decimalArr.length > 1) {
          decimalArr = decimalArr.splice(0,1);
          config.decimalSymbol = decimalArr.join('');
        }
        if (!isNaN(config.decimalSymbol)) {
          config.decimalSymbol = '.'
        }
        var separatingSymbolArr = config.separatingSymbol.split('')
        if (separatingSymbolArr.length > 1) {
          separatingSymbolArr = separatingSymbolArr.splice(0,1);
          config.separatingSymbol = separatingSymbolArr.join('');
        }
        // if (!isNaN(config.separatingSymbol)) {
        //   config.separatingSymbol = ','
        // }

        var numStr = (config.rounding ? number : number.toFixed(config.decimal)).toString().replace('.', config.decimalSymbol);
        var reg = new RegExp("\\" + config.decimalSymbol, "g")
        var dotLength = (numStr.match(reg) ? numStr.match(reg).length : 0);

        if (_.isNumber(opt.digit) && opt.digit !== 0) {
          arr = [self.createArr(0,  opt.digit + dotLength ).concat(numStr).substr(-(opt.digit + dotLength), opt.digit + dotLength)]
        } else {
          arr = [numStr]
        }

        if (!opt.rounding && opt.digit !== 0 && opt.decimal >= opt.digit) {
          opt.decimal = opt.digit;
        }

        if (opt['separating-chart']) {
          arr = [self.dealSChart(arr[0])];
        }

        if (!opt.separate) {
          // return opt.prefix.content + arr.join('') + opt.suffix.content;
          config['num-background-color'] = 'transparent';
        }
        var createSpan = this.createSpan;
        var str = createSpan(opt.prefix, 'prefix');
        arr.forEach(function (obj, i) {
          let objClone = obj;
          var j = 0;
          while (obj.length > j) {
            var cell = obj.substr(j++, 1);
            //当数值为负数且'-'号后一位即为千分位分隔符时跳过
            if (cell == config.separatingSymbol && objClone[j - 2] == '-') continue;
            var className = (cell == config.separatingSymbol ? 'number separate-char': 'number real-number');
            var _style = (cell != config.separatingSymbol && config['fixed-width']) ? ';width:' + config['fixed-width'] + 'px' : '';
            const colorStyle = config['backgroundImage'] ? `;-webkit-background-clip: text; -webkit-text-fill-color: transparent;background-image:${config['backgroundImage']}`: "";
            console.log(config)
            if (!config['separating-background'] && isNaN(_.toNumber(cell))) {
              str += '<span class="' + className + '" style="display:' + config['display']
                + ';letter-spacing:' + config['letter-spacing']
                + ';text-indent:' + config['text-indent']
                + ';height:' + config['height']
                + ';line-height:' + config['line-height']
                + ';font-size:' + config['font-size'] + 'px'
                + ';font-weight:' + config['font-weight']
                + ';letter-spacing:' + config['letter-spacing']
                + ';margin-right:' + config['margin-right']
                + ';border-radius:' + config['border-radius'] + 'px'
                + colorStyle
                + _style
                + ';">' + cell + '</span>';
            } else if(config.template) {
              str += '<div class="titleSpan"><span></span><span></span><span class="' + className + '" style="background-color:' + config['num-background-color']
                + ';display:' + config['display']
                + ';letter-spacing:' + config['letter-spacing']
                + ';text-indent:' + config['text-indent']
                + ';height:' + config['height']
                + ';line-height:' + config['line-height']
                + ';font-size:' + config['font-size'] + 'px'
                + ';font-weight:' + config['font-weight']
                + ';letter-spacing:' + config['letter-spacing']
                + ';margin-right:' + config['margin-right']
                + ';border-radius:' + config['border-radius'] + 'px'
                + colorStyle
                + _style
                + ';">' + cell + '</span></div>';
            } else  {
              str += '<span class="' + className + '" style="background-color:' + config['num-background-color']
                + ';display:' + config['display']
                + ';letter-spacing:' + config['letter-spacing']
                + ';text-indent:' + config['text-indent']
                + ';height:' + config['height']
                + ';line-height:' + config['line-height']
                + ';font-size:' + config['font-size'] + 'px'
                + ';font-weight:' + config['font-weight']
                + ';letter-spacing:' + config['letter-spacing']
                + ';margin-right:' + config['margin-right']
                + ';border-radius:' + config['border-radius'] + 'px'
                + colorStyle
                + _style
                + ';">' + cell + '</span>';
            }

          }
        });
        str += createSpan(opt.suffix, 'suffix');

        return str;
      },
      onComplete : function () {
        self.container.css($.extend(true, {
          'color' : config.color
        }, config['inner-style']));
      },
      onSetNumberComplete: function () {
        self.container.find('.prefix').css({"font-family": `"${config.prefix['font-family']}"`})
        self.container.find('.suffix').css({"font-family": `"${config.suffix['font-family']}"`})
      }
    });
    setTimeout(function () {
      self._data = data;
    }, config.duration);
  },
  dealSChart: function (n) {
    var config = this.config;
    var tmp = n.split(config.decimalSymbol);
    var head = tmp[0];
    var tail = tmp[1];
    var res = [];
    head = _.chunk(head.split("").reverse(), 3);
    _.each(head, function (item, i) {
      res.unshift(item.reverse().join(''));
      (i !== head.length-1) && res.unshift(config.separatingSymbol)
    })
    tail && res.push(config.decimalSymbol) && res.push(tail)
    return res.join('');
  },
  render: function(data, options) {
    var cfg = $.extend(true, this.config, options);
    data = _.toNumber(data);
    if (!_.isNumber(data)) {
      try {
        data = parseInt(data);
        if (_.isNaN(data)) {
          data = 0;
        }
      } catch(e) {
        console.log('data error');
      }
    }
    if (data === 0) {
      this.reset();
    } else {
      this.update(data || this._data);
    }
    this.container.css('background-color', cfg['background-color']);
  },
  reset : function () {
    this._data = 0;
    var self = this;
    var config = this.config;
    this.container.counter({
      sameDataFlip: config.sameDataFlip,
      countTo : 0,
      duration: 0,
      prefix: config.prefix || '',
      suffix: config.suffix || '',
      separate: config.separate || false,
      numberFormatter : function (number) {
        var opt = config;
        if (!_.isNumber(number) || number === 0) {
          number = 0;
        }
        number = Math.round(number);
        var arr;
        var decimalArr = config.decimalSymbol.split('')
        if (decimalArr.length > 1) {
          decimalArr = decimalArr.splice(0,1);
          config.decimalSymbol = decimalArr.join('');
        }
        if (!isNaN(config.decimalSymbol)) {
          config.decimalSymbol = '.'
        }
        var separatingSymbolArr = config.separatingSymbol.split('')
        if (separatingSymbolArr.length > 1) {
          separatingSymbolArr = separatingSymbolArr.splice(0,1);
          config.separatingSymbol = separatingSymbolArr.join('');
        }
        if (!isNaN(config.separatingSymbol)) {
          config.separatingSymbol = ','
        }

        var numStr = (config.rounding ? number : number.toFixed(config.decimal)).toString().replace('.', config.decimalSymbol);
        // var numStr = number.toString();
        var reg = new RegExp("\\"+config.decimalSymbol, "g")
        var dotLength = (numStr.match(reg) ? numStr.match(reg).length : 0);

        if (_.isNumber(opt.digit) && opt.digit !== 0) {
          arr = [self.createArr(0,  opt.digit + dotLength ).concat(numStr).substr(-(opt.digit + dotLength), opt.digit + dotLength)]
        } else {
          arr = [numStr]
        }

        if (!opt.rounding && opt.digit !== 0 && opt.decimal >= opt.digit) {
          opt.decimal = opt.digit;
        }

        if (!opt.separate) {
          config['num-background-color'] = 'transparent';
        }
        var createSpan = this.createSpan;
        var str = createSpan(opt.prefix, 'prefix');
        arr.forEach(function (obj, i) {
          var j = 0;
          while (obj.length > j) {
            var cell = obj.substr(j++, 1);
            const colorStyle = config['backgroundImage'] ? `;-webkit-background-clip: text; -webkit-text-fill-color: transparent;background-image:${config['backgroundImage']}`: "";
            if (!config['separating-background'] && isNaN(_.toNumber(cell))) {
              str += '<span class="number" style="display:' + config['display']
                + ';letter-spacing:' + config['letter-spacing']
                + ';text-indent:' + config['text-indent']
                + ';height:' + config['height']
                + ';line-height:' + config['line-height']
                + ';font-size:' + config['font-size'] + 'px'
                + ';font-weight:' + config['font-weight']
                + ';letter-spacing:' + config['letter-spacing']
                + ';margin-right:' + config['margin-right']
                + ';border-radius:' + config['border-radius'] + 'px'
                + colorStyle
                + ';">' + cell + '</span>';
            } else {
              str += '<span class="number" style="background-color:' + config['num-background-color']
                + ';display:' + config['display']
                + ';letter-spacing:' + config['letter-spacing']
                + ';text-indent:' + config['text-indent']
                + ';height:' + config['height']
                + ';line-height:' + config['line-height']
                + ';font-size:' + config['font-size'] + 'px'
                + ';font-weight:' + config['font-weight']
                + ';letter-spacing:' + config['letter-spacing']
                + ';margin-right:' + config['margin-right']
                + ';border-radius:' + config['border-radius'] + 'px'
                + colorStyle
                + ';">' + cell + '</span>';
            }
          }
        });
        str += createSpan(opt.suffix, 'suffix');
        return str;
      },
      onComplete : function () {
        self.container.css($.extend(true, {
          'color' : config.color
        }, config['inner-style']));
      },
      onSetNumberComplete: function () {
        self.container.find('.prefix').css({"font-family": `"${config.prefix['font-family']}"`})
        self.container.find('.suffix').css({"font-family": `"${config.suffix['font-family']}"`})
      }
    });
  }
});
