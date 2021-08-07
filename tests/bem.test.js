import createBem, { getArgs, addElement, addModifications, defaultConf } from '../src/bem/index';

const { delimiters } = defaultConf;

test('Defining arguments', () => {
  const args = getArgs('parentBlock');
  expect(args()).toEqual({ block: 'parentBlock', element: null, modifications: null })
  expect(args('element')).toEqual({ block: 'parentBlock', element: 'element', modifications: null })
  expect(args({ mod: 1 })).toEqual({ block: 'parentBlock', element: null, modifications: { mod: 1 } })
  expect(args('block', 'element')).toEqual({ block: 'block', element: 'element', modifications: null })
  expect(args('element', { mod: 1 })).toEqual({ block: 'parentBlock', element: 'element', modifications: { mod: 1 } })
  expect(args('block', 'element', { mod: 1 })).toEqual({ block: 'block', element: 'element', modifications: { mod: 1 } })
})

test('Add Element', () => {
  expect(addElement('element')(delimiters)('block')).toBe('block__element')
})

test('Add Modifications', () => {
  expect(addModifications({})(delimiters)('block__element')).toBe('block__element')
  expect(addModifications({ mod: true })(delimiters)('block__element')).toBe('block__element block__element--mod')
  expect(addModifications({ mod: false })(delimiters)('block__element')).toBe('block__element')
  expect(addModifications({ color: 'red' })(delimiters)('block__element')).toBe('block__element block__element--color-red')
  expect(addModifications({ color: '' })(delimiters)('block__element')).toBe('block__element')
  expect(addModifications({ size: 1 })(delimiters)('block__element')).toBe('block__element block__element--size-1')
  expect(addModifications({ size: 'small', color: 'red' })(delimiters)('block__element')).toBe('block__element block__element--size-small block__element--color-red')
  expect(addModifications(['red', 'small'])(delimiters)('block__element')).toBe('block__element block__element--red block__element--small')
})

test('Create bem class', () => {
  const b = createBem(defaultConf)('parentBlock');
  expect(b()).toBe('parent-block')
  expect(b('element')).toBe('parent-block__element')
  expect(b({ mod: 1 })).toBe('parent-block parent-block--mod-1')
  expect(b({ mod: 1, mod2: 2 })).toBe('parent-block parent-block--mod-1 parent-block--mod2-2')
  expect(b('block', 'element')).toBe('block__element')
  expect(b('element', { mod: 1 })).toBe('parent-block__element parent-block__element--mod-1')
  expect(b('block', 'element', { mod: 1 })).toBe('block__element block__element--mod-1')
})
