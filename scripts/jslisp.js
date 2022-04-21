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

function log(fn) {
  console.log(fn);
}

function equal(a, b) {
  return a === b;
}

function cond(cond, ...args0) {
  return function(consequent, ...args1) {
    return function(alternative, ...args2) {
      if (cond(...args0)) {
        return nextStatement(consequent, ...args1);
      }
      return nextStatement(alternative, ...args2);
    }
  }
}

function letvar(name, val) {
  var that = { [name]: val };
  return nextStatement.bind(that);
}

function lambda(params) {
  params = params[0].split(" ");
  const refs = params.map($);
  return function(head, ...body) {
    console.log("unlink");
    for (let i = 0; i < params.length; i++) {
      this[params[i]] = undefined;
    }
    return function(...args) {
      // set args.
      for (let i = 0; i < params.length; i++) {
        refs[i].valueOf = () => args[i];
      }
      const returnval = head(...body);
      // clear args.
      return returnval;
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
}

function nextStatement(car, ...cdr) {
  if (typeof car == "function" && cdr.length) {
    return car(...cdr);
  }
  if (!cdr.length) {
    return car;
  }
}

function define(name) {
  return (function(car, ...cdr) {
    if (cdr.length == 1) {
      this[name[0]] = cdr;
    }
    this[name[0]] = car.call(this, ...cdr);
    return nextStatement;
  }).bind(this);
}

globalThis.scheme = {
  define,
  log,
  plus,
  nextStatement,
  cond,
  $,
  cons,
  foreach,
  equal,
  letvar,
  };
globalThis.define = define.bind(globalThis);
globalThis.log = log;
globalThis.plus = plus;
globalThis.$ = $;
globalThis.nextStatement = nextStatement;
globalThis.cond = cond;
globalThis.equal = equal;
globalThis.cons = cons;
globalThis.foreach = foreach;
globalThis.equal = equal;
globalThis.letvar = letvar;
globalThis.lambda = lambda;

