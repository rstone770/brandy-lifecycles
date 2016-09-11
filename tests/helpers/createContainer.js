/**
 * Stubbed out factory for brandy v2.
 *
 * @returns {{bind: (function()), factory: (function()), instance: (function(): Object)}}
 */
export default () => {
  const api = {
    bind: () => api,
    factory: () => api,
    instance: () => Object.create(null)
  };

  return api;
};
