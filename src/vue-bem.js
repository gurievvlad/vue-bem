import createBem from './bem/index';

export default {
  /** @todo Описать config */
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
