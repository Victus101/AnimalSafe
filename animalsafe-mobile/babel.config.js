module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { web: { useTransformReactJsxSource: true } }],
    ],
    plugins: [
      ['@babel/plugin-proposal-export-namespace-from'],
      [
        'react-native-reanimated/plugin',
        {
          globals: ['__scanCodes'],
        },
      ],
    ],
  };
};
