const arr = [[1, 2, [3, 4, [5, [6], 7], 8, [9, [0]]]]]

Array.prototype.myFlat = function (depth = 1) {
  if (!Array.isArray(this)) throw new TypeError('type error');

  return this.reduce((acc, cur) => {
    if (Array.isArray(cur) && depth > 0) return acc.concat(cur.myFlat(depth - 1));
    return acc.concat(cur);
  }, []);
}

console.log(arr.myFlat(2));