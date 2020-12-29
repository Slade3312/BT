module.exports = (api) => {
  /**
   * Check to see if environment is test or not
   * NOTE: this line automatically enables cache
   */
  const isTest = api.env(['test']);
  const isProduction = api.env(['production']);

  return {
    presets: [
      '@babel/react',
      ['@babel/env', {
        modules: isTest ? 'commonjs' : false,
        loose: true,
        useBuiltIns: 'usage',
        corejs: 3,
        targets: isTest ? {
          node: 'current',
        } : {
          browsers: ['last 2 versions', 'safari >= 7', 'ie >= 10'],
        },
      }],
    ],
    plugins: [
      ['@babel/proposal-decorators', { legacy: true }],
      ['@babel/proposal-class-properties', { loose: true }],
      '@babel/proposal-object-rest-spread',
      ['@babel/transform-runtime', { helpers: true, regenerator: true }],
      ...isProduction ? [
        ['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }],
        '@babel/transform-react-constant-elements',
        '@babel/transform-react-inline-elements',
      ] : [
        'react-hot-loader/babel',
      ],
    ],
    ignore: [
      /\/core-js/,
    ],
  };
};
