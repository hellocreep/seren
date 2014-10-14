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