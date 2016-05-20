interface Array<T> {
   mapToObject<U>(keyFn: (T) => string, valFn: (T) => U): Object;
}

Array.prototype.mapToObject = function (keyFn, valFn) {
  return this.reduce((o, v) => {
    o[keyFn(v)] = valFn(v)
    return o
  }, {})
}

interface Object {
  mapToArray<U, V>(fn: (string, U) => V): [V];
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
