(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require('./util');

function Data() {
  this.data = [];
}

Data.prototype = {
  find: function(condition) {
    var result = [];
    var data = this.data;
    if(!condition) return data;
    util.each(condition, function(val, key) {
      result = util.filter(data, function(item) {
        return item[key] === val;
      });
    });
    return result;
  },
  remove: function(condition, cb) {
    var data = this.data;
    var result = [];
    if(!condition) return (this.data = []);
    util.each(data, function(item, index) {
      var flag = true;
      util.each(condition, function(val, key) {
        if(item[key] !== val) {
          return (flag = false);
        }
      });
      if(flag) {
        result.push(data.slice(index, index + 1).pop());
        data = data.slice(0, index).concat(data.slice(index + 1));
      }
    });
    this.data = data;
    cb && cb();
    return result;
  },
  update: function(condition, update) {
    var data = this.data;
    var result = [];
    this.data = util.each(data, function(item) {
      var flag = true;
      var updatedItem = item;
      util.each(condition, function(con, key) {
        if(item[key] !== con) {
          return (flag = false);
        } else {
          util.each(update, function(up, upKey) {
            updatedItem[upKey] = up;
          });
        }
        if(flag) {
          result.push(updatedItem);
          return updatedItem;
        }
        return item;
      });
    });
    return result;
  },
  create: function(obj) {
    this.data.push(obj);
    return obj;
  }
}

module.exports = Data;
},{"./util":3}],2:[function(require,module,exports){
var Data          = require('./data');
var util          = require('./util');

var inherit       = util.inherit;
var proxy         = util.proxy;
var whiteSpaceRe  = util.whiteSpaceRe;
var privatePrefix = util.privatePrefix;
var hasOwnprop    = util.hasOwnprop;
var slice         = util.slice;
var isFunction    = util.isFunction;

function Seren(el, opts) {
  this.$el    = $(el);
  this.data   = new Data;
  this.events = {};
  return this._init(opts);
}

Seren.prototype._init = function(opts) {
  var self = this;
  util.each(opts, function(val, key) {
    if(self[key]) {
      var temp = self[key];
      self[privatePrefix + key] = temp;
    }
    self[key] = val;
  });
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
  var self = this;
  if(opts) {
    util.each(opts, function(val, key) {
      var selector = key.split(whiteSpaceRe)[0];
      var evt      = key.split(whiteSpaceRe)[1];
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
}

// TODO
// Unbind the jquery function
Seren.prototype.off = function(evt, func) {
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
}

Seren.prototype.emit = function(name) {
  var args  = slice.call(arguments, 1);
  var funcs = this.events[name];
  var self  = this;

  util.each(funcs, function(func) {
    func.apply(self, args);
  });
  return this;
}

Seren.prototype.setData = function(data) {
  this.data.data = data;
  return this;
}

Seren.prototype.render = function(target, data) {
  var tmpl = this.templateEngine(this.templateStr);
  this.find(target).html(tmpl(data));
  return this;
}

Seren.prototype.fetch = function(opts) {
  if(!opts) opts           = {};
  if(!opts.url) opts.url   = this.urls.fetch || '';
  if(!opts.type) opts.type = 'get';
  this._deferred = $.ajax(opts);
}

Seren.prototype.save = function(opts) {
  if(!opts) opts           = {};
  if(!opts.data) opts.data = this.data;
  if(!opts.url) opts.url   = this.urls.save || '';
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
  util.each(opts, function(val, key) {
    child.prototype[key] = val;
  });

  return child;
}

Seren.data = function() {
  var args = slice.call(arguments);
  util.each(arguments, function(val, key) {
    if(!hasOwnprop.call(Data.prototype, key)) {
      Data.prototype[key] = val;
    }
  });
}

window.Seren = Seren;
},{"./data":1,"./util":3}],3:[function(require,module,exports){
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

function filter(arr, func) {
  if(Array.prototype.filter) return Array.prototype.filter.call(arr, func);
  var len = arr.length;
  var re = [];
  for(var i = 0; i < len; i++) {
    re.push(func(arr[i], i, arr));
  }
}

function each(obj, func) {
  if(isArray(obj)) {
    var len = obj.length;
    for(var i = 0; i < len; i ++) {
      func(obj[i], i, obj);
    }
  } else {
    for(var o in obj) {
      func(obj[o], o, obj);
    }
  }
  return obj;
}

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

var util = {
  filter: filter,
  each: each,
  inherit: inherit,
  proxy: proxy,
  whiteSpaceRe: /\s/g,
  privatePrefix: '__',
  hasOwnprop: {}.hasOwnProperty,
  slice: [].slice,
  isObject: isObject,
  isFunction: isFunction,
  isArray: isArray
}

module.exports = util;
},{}]},{},[2]);
