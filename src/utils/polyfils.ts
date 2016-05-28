interface Array<T> {
  mapToObject<U>(keyFn: (T) => string, valFn: (T) => U): Object
  find(predicate: (search: T) => boolean): T
  includes(search: T): boolean
}

Array.prototype.mapToObject = function (keyFn, valFn) {
  return this.reduce(
    (o, v) => {
      o[keyFn(v)] = valFn(v)
      return o
    },
    {}
  )
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement) {
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

interface Object {
  mapToArray<U, V>(fn: (str: string, U) => V): [V]
}

Object.defineProperty(Object.prototype, 'mapToArray', {
  value: function (fn) {
    let arr = []
    for (let index in this) {
      arr.push(fn(index, this[index]))
    }
    return arr
  },
})

interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any
}

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
