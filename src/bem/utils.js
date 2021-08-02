export const isBoolean = val => val && typeof val === 'boolean';
export const isString = val => val && typeof val === 'string' && val.length > 0;
export const isObject = val => val
  && typeof val === 'object' && true && val.constructor === Object
  && Object.keys(val).length > 0;
export const isNumber = val => typeof val === 'number' && isFinite(val);
export const isArray = val => Array.isArray(val) && val.length > 0;

export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
export const hyphenate = str => str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
