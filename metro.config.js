// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (process.env.EXPO_PUBLIC_MOCK_ENABLED === 'true')
  config.resolver.sourceExts = ['mock.ts', ...config.resolver.sourceExts];

module.exports = config;
