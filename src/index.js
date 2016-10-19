const SINGLETON = 'singleton',
      TRANSIENT = 'transient';

const createFromConstructor = (ctor, args) => new (Function.bind.apply(ctor, [null, ...args]))();

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
       * Creates a factory method that will cache results into the singletons cache.
       *
       * @param {string} name
       * @param {function} activator
       * @returns {function(...[*])}
       */
      const createSingletonFactory = (name, activator) => {
        return (...dependencies) => {
          const descriptor = singletons[name];

          if (!descriptor.isCreated) {
            descriptor.value = activator(...dependencies);
            descriptor.isCreated = true;
          }

          return descriptor.value;
        };
      };

      /**
       * Binds a constructor to a name.
       *
       * @param {string} name
       * @param {function} constructor
       * @param {object} options
       * @returns {object}
       */
      const bind = (name, constructor, options) => {
        if (typeof constructor !== 'function') {
          throw new TypeError('constructor must be a function.');
        }

        if (getLifecycleFromOptions(options) === SINGLETON) {
          factory(
            name,
            (...dependencies) => createFromConstructor(constructor, dependencies),
            options
          );
        } else {
          container.bind(name, constructor, options);
        }

        return api;
      };

      /**
       * Binds a factory to a name.
       *
       * @param {string} name
       * @param {function} factory
       * @param {object} options
       * @returns {object}
       */
      const factory = (name, factory, options) => {
        if (typeof factory !== 'function') {
          throw new TypeError('factory must be a function.');
        }

        if (getLifecycleFromOptions(options) === SINGLETON) {
          singletons[name] = createSingleton();
          container.factory(
            name,
            createSingletonFactory(name, factory),
            options
          );
        } else {
          singletons[name] = null;
          container.factory(name, factory, options);
        }

        return api;
      };

      /**
       * Enhanced API;
       *
       * @type {object}
       */
      const api = {
        ...container,
        bind,
        factory
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
