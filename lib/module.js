var Data          = require('./data');
var util          = require('./util');

var inherit       = util.inherit;
var proxy         = util.proxy;
var privatePrefix = '__';
var hasOwnprop    = {}.hasOwnProperty;
var slice         = [].slice;

function Seren(el, opts) {
  this.$el    = $(el);
  this.data   = new Data;
  this.events = {};
  return this._init(opts);
}

Seren.prototype = {
  _init: function(opts) {
    var self = this;
    util.each(opts, function(val, key) {
      if(self[key]) {
        var temp = self[key];
        self[privatePrefix + key] = temp;
      }
      self[key] = val;
    });
    if(typeof this.init == 'function') this.init();
    return this;
  },
  find: function(selector) {
    return this.$el.find(selector);
  },
  on: function() {
    var args = slice.call(arguments);
    var opts = args[0];
    var self = this;
    if(opts) {
      util.each(opts, function(val, key) {
        var args     = key.split(/\s/);
        var selector = args[0];
        var evt      = args[1];
        var handler  = val;
        if(typeof handler == 'string') {
          handler = self[handler];
          (self.events[handler] = self.events[handler] || []).push(handler);
        } else {
          (self.events[handler.name] = self.events[handler] || []).push(handler);
        }
        self.$el.on(evt, selector, proxy(handler, self));
      })
    }
    return this;
  },
  // TODO
  // Unbind the jquery function
  off: function(evt, func) {
    var self = this;
    if(func) {
      var funcs = this.events[evt];
      util.each(funcs, function(item, index) {
        if(item === func) {
          self.events.splice(index, 1);
          // self.$el.off()
        }
      });
    } else {
      evt.replace(/\S+/g, function(name) {
        self.events[evt] = [];
      });
    }
    return this;
  },
  emit: function(evt) {
    var args  = slice.call(arguments, 1);
    var funcs = this.events[evt];
    var self  = this;

    util.each(funcs, function(func) {
      func.apply(self, args);
    });
    return this;
  },
  setData: function(data) {
    this.data.data = data;
    return this;
  }
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
  util.each(opts, function(val, key) {
    child.prototype[key] = val;
  });

  return child;
}

Seren.data = function() {
  util.each(arguments[0], function(val, key) {
    if(!hasOwnprop.call(Data.prototype, key)) {
      Data.prototype[key] = val;
    }
  });
}

window.Seren = Seren;