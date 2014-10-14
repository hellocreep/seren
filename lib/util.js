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