import { isNumber, isObject, isArray, isBoolean, isString, pipe, hyphenate } from './utils.js';


const getArgs = parentBlock => (...args) => {
  switch (args.length) {
    case 3:
      return {block: args[0], element: args[1], modifications: args[2]}
    case 2:
      return {block: parentBlock, element: args[0], modifications: args[1]}
    case 1:
      return {
        block: parentBlock,
        element: isString(args[0]) ? args[0] : null,
        modifications: !isString(args[0]) ? args[0] : null
      }
    default:
      return {block: parentBlock, element: null, modifications: null}
  }
}

const addElement = el => acc => isString(el) ? `${acc}__${el}` : acc;

const addModifications = mods => acc => {
  if (!mods) {
    return acc;
  }
  if (isString(mods)) {
    return `${acc} ${acc}--${mods}`;
  }
  if (isArray(mods)) {
    return mods.reduce((a, b) => `${a} ${acc}--${b} `, acc);
  }
  if (isObject(mods)) {
    return Object.keys(mods).reduce((a, prop) => {
      if (isString(mods[prop]) || isNumber(mods[prop])) {
        return `${a} ${acc}--${prop}-${mods[prop]} `
      }
      if (isBoolean(mods[prop])) {
        return mods[prop] ? `${a} ${acc}--${prop} ` : a;
      }
      return a;
    }, acc);
  }
}

const createBemInstants = parentBlock => (...args) => {
  let {block, element, modifications} = getArgs(parentBlock)(...args);
  console.log({block, element, modifications})

  return pipe(
    b => b,
    addElement(element),
    addModifications(modifications),
    hyphenate
  )(block)
}

const b = createBemInstants('form');

const a = true,
  c = 'blue'


console.log(b({a, c}))
