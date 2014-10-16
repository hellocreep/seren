function isArray(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
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

function inherit(proto) {
  if(Object.create) {
    return Object.create(proto);
  } else {
    function F() {};
    F.prototype = proto;
    return new F;
  }
}

function proxy(func, context) {
  return function() {
    return func.apply(context, arguments);
  }
}

module.exports = {
  filter: filter,
  each: each,
  inherit: inherit,
  proxy: proxy,
}