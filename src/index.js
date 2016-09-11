const SINGLETON = 'singleton',
      TRANSIENT = 'transient';

/**
 * Ensures that a value is a lifecycle assignable value.
 *
 * @param {*} value
 * @returns {string}
 */
const ensureValidLifeCycleValue = (value) => {
  switch (`${value}`.toLowerCase()) {
    case SINGLETON:
      return SINGLETON;
    case TRANSIENT:
      return TRANSIENT;
    default:
      throw new Error(`lifecycle must be either ${SINGLETON} or ${TRANSIENT} but received ${value}.`);
  }
};

/**
 * Creates a singleton descriptor object to cache activations.
 *
 * @returns {{isCreated: boolean, value: null}}
 */
const createSingleton = () => {
  return {
    isCreated: false,
    value: null,
  };
};

export const configureLifecycles = (defaultLifecycle) => {
  ensureValidLifeCycleValue(defaultLifecycle);

  /**
   * Given an options object, return a normalized lifecycle.
   *
   * @param {object} options
   * @returns {string}
   */
  const getLifecycleFromOptions = (options) => {
    const lifecycle = options == null || options.lifecycle == null
      ? defaultLifecycle
      : options.lifecycle;

    return ensureValidLifeCycleValue(lifecycle);
  };

  /**
   * Inner, configured enhancer.
   *
   * @param {function} createContainer
   * @returns {function}
   */
  return (createContainer) => {
    if (typeof createContainer !== 'function') {
      throw new TypeError('createContainer must be a function.');
    }

    /**
     * Enhancer factory,
     *
     * @returns {object}
     */
    return () => {
      const container = createContainer(),
            singletons = {};

      /**
       * Enhances a registration method so that it auto registers singleton activators.
       *
       * @param {function} next
       * @returns {function(*=, *=, *=)}
       */
      const enhanceRegistrationMethod = (next) => {
        return (name, activator, options) => {
          const lifecycle = getLifecycleFromOptions(options);

          if (lifecycle === SINGLETON) {
            singletons[name] = createSingleton();
          }

          next(name, activator, options);

          return api;
        };
      };

      /**
       * Binds a constructor, supporting singletons.
       *
       * @param {string} name
       * @param {function} constructor
       * @param {object=} options
       * @returns {object}
       */
      const bind = enhanceRegistrationMethod(container.bind);

      /**
       * Binds a factory, supporting singletons.
       *
       * @param {string} name
       * @param {function} factory
       * @param {object=} options
       * @returns {object}
       */
      const factory = enhanceRegistrationMethod(container.factory);

      /**
       * Returns instance bound by its name. Singleton values, always return the same instance.
       *
       * @param {string} name
       * @returns {*}
       */
      const instance = (name) => {
        const singleton = singletons[name],
              next = container.instance;

        if (singleton != null) {
          if (singleton.isCreated === false) {
            singleton.value = next(name);
            singleton.isCreated = true;
          }

          return singleton.value;
        }

        return next(name);
      };

      /**
       * Enhanced API;
       *
       * @type {object}
       */
      const api = {
        ...container,
        bind,
        factory,
        instance
      };

      return api;
    };
  };
};

/**
 * Supported lifecycle types.
 *
 * @type {{SINGLETON: string, TRANSIENT: string}}
 */
export const types = {
  SINGLETON,
  TRANSIENT
};

/**
 * Enhancer with default configuration values.
 *
 * @param {function} createEnhancer
 * @returns {function}
 */
export const lifecycles = configureLifecycles(SINGLETON);
