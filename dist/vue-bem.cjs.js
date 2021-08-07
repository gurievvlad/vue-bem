'use strict';

const isBoolean = val => val && typeof val === 'boolean';
const isString = val => val && typeof val === 'string' && val.length > 0;
const isObject = val =>
  val &&
  typeof val === 'object' &&
  true &&
  val.constructor === Object &&
  Object.keys(val).length > 0;
const isNumber = val => typeof val === 'number' && isFinite(val);
const isArray = val => Array.isArray(val) && val.length > 0;

/**
 * @param {function} fns
 * @return {function(*=): *}
 */
const pipe =
  (...fns) =>
  x =>
    fns.reduce((v, f) => f(v), x);
/**
 * hyphenate translate camelCase to kebab-case
 * @param {string} str
 * @return {string}
 */
const hyphenate = str => str.replace(/\B([A-Z])/g, '-$1').toLowerCase();

/**
 * @typedef {object} BEM
 * @property {string | null} block
 * @property {string | null} element
 * @property {string[], {} | null} modifications
 */

/**
 * getArgs returns an object with block, element and modifiers
 * @name getArgs
 * @param parentBlock
 * @return {(function(...[*]): (BEM))|*}
 */
const getArgs =
  parentBlock =>
  /**
   * @param {string | array | object} args - Zero to three arguments
   * @return {BEM}
   */
  (...args) => {
    switch (args.length) {
      case 3:
        return { block: args[0], element: args[1], modifications: args[2] };
      case 2:
        return {
          block: isString(args[1]) ? args[0] : parentBlock,
          element: isString(args[1]) ? args[1] : args[0],
          modifications: !isString(args[1]) ? args[1] : null,
        };
      case 1:
        return {
          block: parentBlock,
          element: isString(args[0]) ? args[0] : null,
          modifications: !isString(args[0]) ? args[0] : null,
        };
      default:
        return { block: parentBlock, element: null, modifications: null };
    }
  };

const addElement = el => delimiters => acc =>
  isString(el) ? `${acc}${delimiters.el}${el}` : acc;

const addModifications = mods => delimiters => acc => {
  if (isArray(mods)) {
    return mods.reduce((a, b) => `${a} ${acc}${delimiters.mod}${b}`, acc);
  }
  if (isObject(mods)) {
    return Object.keys(mods).reduce((a, prop) => {
      if (isString(mods[prop]) || isNumber(mods[prop])) {
        return `${a} ${acc}${delimiters.mod}${prop}${delimiters.modVal}${mods[prop]}`;
      }
      if (isBoolean(mods[prop])) {
        return mods[prop] ? `${a} ${acc}${delimiters.mod}${prop}` : a;
      }
      return a;
    }, acc);
  }
  return acc;
};

/** @type BemPlugConfig */
const defaultConf = {
  hyphenate: true,
  methodName: 'b',
  delimiters: {
    el: '__',
    mod: '--',
    modVal: '-',
  },
};

/**
 * createBem is a wrapper for the whole plugin. Should get a config object
 * @param {BemPlugConfig} [config]
 * @return {function}
 */
const createBem = (config = defaultConf) =>
  /**
   * bemInstants create instants Bem in component
   * @param {string} parentBlock - Component name or any main css class
   * @return {b}
   */
  function bemInstants(parentBlock) {
    /**
     * b creates class (s) according to the bem system.
     * The type of arguments depends on their number (from 0 to 3).
     * With zero arguments: the root class will be created (corresponding to parentBlock);
     * One argument: if the argument is a string, then an element
     * from the main block will be created,
     * if the argument is an array or an object is a root class with modifiers;
     * Two arguments: if both arguments are strings, then the first will be a block,
     * the second of elements,if the first is a string, and the second is an array or object,
     * an element with modifiers will be obtained.
     * Three arguments: block + element + modifiers
     * @name b
     * @param {(string | array | object)[]} args - Zero to three arguments
     * @return {string} - BEM classes
     * @example
     * // component name is App
     * b() // app
     * b('header') // app__header
     * b({ dark: true }) // app app--dark
     * b({ dark: true, mainColor: 'red' }) // app app--dark app--main-color-red
     * b('header, { dark: true }) // app__header app__header--dark
     * b('home-page', 'header) // home-page__header
     * b('home-page', 'header, { dark: true }) // home-page__header home-page__header--dark
     */
    return function b(...args) {
      const conf = {
        ...defaultConf,
        ...config,
        delimiters: {
          ...defaultConf.delimiters,
          ...config.delimiters,
        },
      };
      let { block, element, modifications } = getArgs(parentBlock)(...args);

      return pipe(
        b => b,
        addElement(element)(conf.delimiters),
        addModifications(modifications)(conf.delimiters),
        b => (conf.hyphenate ? hyphenate(b) : b),
      )(block);
    }
  };

/**
 * @typedef {object} BemPlugConfig
 * @property {boolean} hyphenate
 * @property {string} methodName
 * @property {object} delimiters
 * @property {string} [delimiters.el]
 * @property {string} [delimiters.mod]
 * @property {string} [delimiters.modVal]
 */

var vueBem = {
  /**
   * Install
   * @param app
   * @param {BemPlugConfig} options
   */
  install: (app, options) => {
    const bemInstants = createBem(options || defaultConf);

    app.mixin({
      created() {
        this[options.methodName || 'b'] = bemInstants(
          this.$options.block || this.$options.name,
        );
      },
    });
  },
};

module.exports = vueBem;
