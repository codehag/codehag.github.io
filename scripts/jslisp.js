function $(name) {
  if (!this.args) this.args = 0;
  this["a" + this.args++] = name[0];
}

function plus (x, ...y) {
  if (!y.length) {
    return x;
  }
  return x + plus(...y);
}

function log(fn) {
  console.log(fn());
}
function define(name) {
  return (function(car, ...cdr) {
    scheme[name[0]] = car.call(this, ...cdr);
  })
}

globalThis.scheme = { define, log, plus, $};

