export const isBoolean = val => val && typeof val === 'boolean';
export const isString = val => val && typeof val === 'string' && val.length > 0;
export const isObject = val =>
  val &&
  typeof val === 'object' &&
  true &&
  val.constructor === Object &&
  Object.keys(val).length > 0;
export const isNumber = val => typeof val === 'number' && isFinite(val);
export const isArray = val => Array.isArray(val) && val.length > 0;

/**
 * @param {function} fns
 * @return {function(*=): *}
 */
export const pipe =
  (...fns) =>
  x =>
    fns.reduce((v, f) => f(v), x);
/**
 * hyphenate translate camelCase to kebab-case
 * @param {string} str
 * @return {string}
 */
export const hyphenate = str => str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
