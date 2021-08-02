/** @type BemPlugConfig */
const defaultConf = {
  hyphenate: false,
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
    const bemInstants = createBem(options);

    app.mixin({
      created() {
        this[options.methodName || 'b'] = bemInstants(
          this.$options.block || this.$options.name,
        );
      },
    });
  },
};

export { vueBem as default };
