(function(root, facotry) {
  if(typeof define === 'function' && define.amd) {
    define(['jquery'], function($) {
      root.Seren = facotry(root, jQuery);
    });
  } else if(typeof define === 'function' && define.cmd) {
    define(['jquery'], function(require, exports, module) {
      var $ = require('jquery');
      root.Seren = facotry(root, $);
    });
  } else {
    root.Seren = facotry(root, root.jQuery);
  }
})(this, function(root, jQuery) {

  var inherit = function(proto) {
    if(Object.create) {
      return Object.create(proto);
    } else {
      function F() {};
      F.prototype = proto;
      return new F;
    }
  }

  var proxy = function(func, context) {
    return function() {
      return func.apply(context, arguments);
    }
  }

  var whiteSpaceRe  = /\s/g;
  var privatePrefix = '__';
  var hasOwnprop    = {}.hasOwnProperty;
  var slice         = [].slice;

  var _type = function(obj) {
    return Object.prototype.toString.call(obj).match(/\s\w*/)[0].toLowerCase().replace(whiteSpaceRe, '');
  }

  var isObject = function(obj) {
    return _type(obj) == 'object';
  }

  var isArray = function(obj) {
    return _type(obj) == 'array';
  }

  var isFunction = function(obj) {
    return _type(obj) == 'function';
  }

  function Seren(el, opts) {
    this.$el  = $(el);
    this.data = {};
    return this._init(opts);
  }

  Seren.prototype._init = function(opts) {
    for(var o in opts) {
      if(this[o]) {
        var temp = this[o];
        this[privatePrefix+o] = temp;
      }
      this[o] = opts[o];
    }
    this.templateStr = $(this.template).html();
    if(isFunction(this.init)) this.init();
    return this;
  }

  Seren.prototype.find = function(selector) {
    return this.$el.find(selector);
  }

  Seren.prototype.on = function() {
    var args = slice.call(arguments);
    var opts = args[0];
    if(opts) {
      for(var o in opts) {
        var selector = o.split(whiteSpaceRe)[0];
        var evt      = o.split(whiteSpaceRe)[1];
        var handler  = opts[o];
        if(typeof handler == 'string') {
          handler = this[handler];
        }
        this.$el.on(evt, selector, proxy(handler, this));
      }
    }
    return this;
  }

  Seren.prototype.set = function(name, value) {
    this.data[name] = value;
    return this;
  }

  Seren.prototype.get = function(name) {
    return this.data[name] || null;
  }

  Seren.prototype.render = function(target, data) {
    var tmpl = this.templateEngine(this.templateStr);
    this.find(target).html(tmpl(data));
    return this;
  }

  Seren.prototype.save = function(opts) {
    if(!opts) opts           = {};
    if(!opts.data) opts.data = this.data;
    if(!opts.url) opts.url   = this.url || '';
    if(!opts.type) opts.type = 'post';
    this._deferred           = $.ajax(opts);
    return this;
  }

  Seren.prototype.done = function(cb) {
    var self = this;
    this._deferred.done(function(result) {
      cb.call(self, result);
    });
    return this;
  }

  Seren.prototype.fail = function(cb) {
    var self = this;
    this._deferred.fail(function(result) {
      cb.call(self, result);
    });
    return this;
  }

  // IE8上不支持使用super关键字，无论是作为变量还是属性都会报错
  Seren.prototype._super = function(name) {
    return proxy(this[privatePrefix+name], this);
  }

  Seren.extend = function(opts) {
    var parent = this;
    var child  = function child() {
      return parent.apply(this, arguments);
    }

    child.prototype = inherit(parent.prototype);
    for(var o in opts) {
      child.prototype[o] = opts[o];
    }
    return child;
  }

  return Seren;
});