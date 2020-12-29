module.exports = () => ({
  plugins: {
    'postcss-import': {
      addModulesDirectories: ['node_modules', 'src'],
    },
    'postcss-mixins': { },
    'postcss-url': { url: 'inline', maxSize: 0.25 },
    'postcss-cssnext': {
      browsers: ['last 2 versions', 'ie >= 9', 'ios >= 8'],
    },
    'postcss-nested': {},
  },
});
