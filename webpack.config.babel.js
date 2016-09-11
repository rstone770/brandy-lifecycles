import { join }  from 'path';
import webpack, { optimize } from 'webpack';

/**
 * Are we running in production?
 *
 * @type {boolean}
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Returns loaders configured for this environment.
 *
 * @returns {*[]}
 */
const loaders = () => {
  return [{
    test: join(__dirname, 'src/index.js'),
    loaders: ['babel-loader'],
  }];
};

/**
 * Returns configured output properties for ths environment.
 *
 * @returns {object}
 */
const output = () => {
  return {
    library: 'brandyLifecycles',
    libraryTarget: 'umd'
  };
};

/**
 * Returns configured plugins for this environment.
 *
 * @returns {[]}
 */
const plugins = () => {
  const plugins = [];

  if (isProduction) {
    plugins.push(
      new optimize.UglifyJsPlugin({
        pure_getters: true,
        unsafe_comp: true,
        unsafe: true,
        warnings: false
      })
    );
  }

  return plugins;
};

export default {
  module: {
    loaders: loaders()
  },
  output: output(),
  plugins: plugins()
};
