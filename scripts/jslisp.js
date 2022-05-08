function $(name) {
  let ref = {};
  this[name] = ref;
  return ref;
}

function plus (x, ...y) {
  if (!y.length) {
    return x;
  }
  return x + plus(...y);
}

function log(name) {
  name = name[0];
  return (function (car, ...cdr) {
    if (!cdr.length) {
      console.log(name, car);
    } else {
      console.log(name, car.call(this, ...cdr));
    }
    return conjure.bind(this);
  }).bind(this || globalThis);
}

function equal(a, b) {
  return a === b;
}

function cond(cond, ...args0) {
  return (consequent, ...args1) => {
    return (alternative, ...args2) => {
      if (cond(...args0)) {
        return conjure(consequent, ...args1);
      }
      return conjure(alternative, ...args2);
    }
  }
}

function lambda(params) {
  params = params[0].split(" ");
  const refs = params.map($.bind(this));
  return (head, ...body) => {
    for (let i = 0; i < params.length; i++) {
      this[params[i]] = undefined;
    }
    return function(...args) {
      // set args.
      for (let i = 0; i < params.length; i++) {
        refs[i].valueOf = () => args[i];
      }
      return head(...body);
    }
  }
}

function cons(...args) {
  return [...args];
}

function foreach(head, ...body) {
  for (let i in body) {
    head(i);
  }
  return conjure;
}

class Scheme {
  constructor() {
    return conjure.bind(this);
  }
}


class Conjuration extends Scheme {
  constructor(value) {
    super();
    this.valueOf = () => value;
  }

  define(...args) { return define.call(this, ...args) }
  lambda(...args) { return lambda.call(scheme, ...args) }
}

function conjure(car, ...cdr) {
  if (typeof car == "function" && cdr.length) {
    return new Conjuration(car(...cdr));
  }
  if (!cdr.length) {
    return new Conjuration(car);
  }
}

function define(name) {
  name = name[0].split(" ")[0];
  return (function (car, ...cdr) {
    if (!cdr.length) {
      this[name] = car;
    } else {
      this[name] = car.call(this, ...cdr);
    }
    return conjure.bind(this);
  }).bind(this || globalThis);
}

globalThis.scheme = new Scheme();

