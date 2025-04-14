const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add alias for '@'
  config.resolve.alias['@'] = path.resolve(__dirname, 'src');

  return config;
};
