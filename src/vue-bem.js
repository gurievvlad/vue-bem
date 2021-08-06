import createBem, { defaultConf } from './bem/index';

/**
 * @typedef {object} BemPlugConfig
 * @property {boolean} hyphenate
 * @property {string} methodName
 * @property {object} delimiters
 * @property {string} [delimiters.el]
 * @property {string} [delimiters.mod]
 * @property {string} [delimiters.modVal]
 */

export default {
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
