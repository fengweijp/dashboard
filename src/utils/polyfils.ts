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
      throw new TypeError('Array.prototype.find called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    let list = Object(this)
    let length = list.length >>> 0
    let thisArg = arguments[1]
    let value

    for (let i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return value
      }
    }
    return undefined
  }
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement) {
    let O = Object(this)
    let len = parseInt(O.length, 10) || 0
    if (len === 0) {
      return false
    }
    let n = parseInt(arguments[1], 10) || 0
    let k
    if (n >= 0) {
      k = n
    } else {
      k = len + n
      if (k < 0) {
        k = 0
      }
    }
    let currentElement
    while (k < len) {
      currentElement = O[k]
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true
      }
      k++
    }
    return false
  }
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

if (typeof Object.assign !== 'function') {
  Object.assign = function (target) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    let output = Object(target)
    for (let index = 1; index < arguments.length; index++) {
      let source = arguments[index]
      if (source !== undefined && source !== null) {
        for (let nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey]
          }
        }
      }
    }
    return output
  }
}
