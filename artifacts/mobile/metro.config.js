const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  ...[].concat(config.resolver.blockList || []),
  /[\\/]\.pnpm-store([\\/]|$)/,
];

module.exports = config;
