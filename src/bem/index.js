import {
  isNumber,
  isObject,
  isArray,
  isBoolean,
  isString,
  pipe,
  hyphenate,
} from './utils.js';

/** @todo Описать config */

const getArgs =
  parentBlock =>
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
    return mods.reduce((a, b) => `${a} ${acc}${delimiters.mod}${b} `, acc);
  }
  if (isObject(mods)) {
    return Object.keys(mods).reduce((a, prop) => {
      if (isString(mods[prop]) || isNumber(mods[prop])) {
        return `${a} ${acc}${delimiters.mod}${prop}${delimiters.modVal}${mods[prop]} `;
      }
      if (isBoolean(mods[prop])) {
        return mods[prop] ? `${a} ${acc}${delimiters.mod}${prop} ` : a;
      }
      return a;
    }, acc);
  }
  return acc;
};

/**
 * Создаёт глобальный Bem
 * @param {object} [config]
 * @return {function}
 */
const createBem =
  (config = { delimiters: {} }) =>
  /**
   * bemInstants create instants Bem in component
   * @name bemInstants
   * @param {string} parentBlock - Component name or any main css class
   * @return {function(...[*]): *}
   */
  parentBlock =>
  /**
   * b make css class (classes)
   * @name b
   * @param args — Передайте от нуля до трёх аргументов
   * @return {string}
   */
  (...args) => {
    const conf = {
      hyphenate: false,
      ...config,
      delimiters: {
        el: '__',
        mod: '--',
        modVal: '-',
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
  };

export default createBem;
