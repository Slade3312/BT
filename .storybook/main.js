const mergeWithPCSSLoader = (config) => {
  config.module.rules.push({
    test: /\.pcss$/,
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: '[folder]_[local]_[hash:base64:4]',
        },
      },
      { loader: 'postcss-loader' },
    ],
  });
};

// excludes unused extensions, also remove svg from this loader, because we are using svg react loader
const updateStorybookFilesLoader = config => {
  const foundIndex = config.module.rules.findIndex(rule => {
    return rule.test.toString().indexOf('svg') > -1;
  });
  const curRule = config.module.rules[foundIndex];
  config.module.rules[foundIndex] = {
    ...curRule,
    test: /\.(jpg|jpeg|png|gif|eot|ttf|woff2)(\?.*)?$/,
  };
};

const mergeWithSvgLoader = (config) => {
  config.module.rules.push({
    test: /\.svg$/,
    exclude: /\.url.svg$/,
    use: [{ loader: 'svg-react-loader' }],
  });
};

module.exports = {
  stories: ['../src/**/*.stories.js[x?]'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register'
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules.push('src');
    updateStorybookFilesLoader(config);
    mergeWithPCSSLoader(config);
    mergeWithSvgLoader(config);
    return config;
  },
};
