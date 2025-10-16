const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

Array.prototype.my_reduce = function (callback, initialValue) {
  let acc = initialValue || this.shift();
  for (let i = 0; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

console.log(arr.my_reduce((acc, cur) => acc + cur));