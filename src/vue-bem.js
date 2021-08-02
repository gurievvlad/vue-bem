import createBem from './bem';

export default {
  /** @todo Описать config */
  install: (app, options) => {
    const bemInstants = createBem(options);

    app.mixin({
      created() {
        this[options.methodName] = bemInstants(this.block || this.name);
      },
    });
  },
};
