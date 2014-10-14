var Data          = require('./data');
var Router        = require('./router');
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

Seren.router = function() {

}

window.Seren = Seren;