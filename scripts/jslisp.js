function $(name) {
  let ref = {};
  this[name] = ref;
  return ref;
}

function fold(op, args) {
  if (args.length == 1) {
    return args[0];
  }
  args.unshift(op(args.shift(), args.shift()));
  return fold(op, args);
}

function plus(args) {
  const op = (a, b) => a + b;
  fold(op, args);
}

function sub(args) {
  const op = (a, b) => a - b;
  fold(op, args);
}

function div(args) {
  const op = (a, b) => a / b;
  fold(op, args);
}

function mul(args) {
  const op = (a, b) => a / b;
  fold(op, args);
}

function log(fn) {
  console.log(fn);
}

function equal(a, b) {
  return a.valueOf() === b.valueOf();
}

function lt(a, b) {
  return a.valueOf() < b.valueOf();
}

function lte(a, b) {
  return a.valueOf() <= b.valueOf();
}

function gt(a, b) {
  return a.valueOf() > b.valueOf();
}

function gte(a, b) {
  return a.valueOf() >= b.valueOf();
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
  return [car, ...cdr];
}

function define(name) {
  return (function(car, ...cdr) {
    this[name[0]] = nextStatement(car, ...cdr);
  }).bind(this);
}

globalThis.scheme = {
  define,
  log,
  plus,
  sub,
  div,
  mul,
  nextStatement,
  cond,
  $,
  cons,
  foreach,
  equal,
  lt,
  lte,
  gt,
  gte,
  letvar,
  };

globalThis.define = define.bind(globalThis);
globalThis.log = log;
globalThis.plus = plus;
globalThis.sub = sub;
globalThis.div = div;
globalThis.mul = mul;
globalThis.$ = $;
globalThis.nextStatement = nextStatement;
globalThis.cond = cond;
globalThis.equal = equal;
globalThis.cons = cons;
globalThis.foreach = foreach;
globalThis.equal = equal;
globalThis.lt = lt;
globalThis.lte = lte;
globalThis.gt = gt;
globalThis.gte = gte;
globalThis.letvar = letvar;
globalThis.lambda = lambda;

