const path = require('path');
const webpack = require('webpack');
const browserslist = require('browserslist');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const GitRevisionPlugin = new (require('git-revision-webpack-plugin'))({
  commithashCommand: 'rev-parse --short HEAD',
});

const currentRelease = `MarketEco#${GitRevisionPlugin.commithash()}`;

const isProduction = process.env.NODE_ENV !== 'development';
const isDebug = process.env.DEBUG === 'true';
const isHMR = !!process.argv.find(v => v.includes('webpack-dev-server'));

const patchedReactDOM = '@hot-loader/react-dom';

const bundleFileMask = isProduction ? `[name].${GitRevisionPlugin.commithash()}` : '[name]';
const getBuildEnvironment = () => {
  switch (process.env.CI_BRANCH) {
    case 'master': return 'production';
    case 'develop': return 'development';
    default: return 'local';
  }
};

const cssLoader = {
  loader: !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
  options: {
    hmr: !isProduction,
  },
};

module.exports = {
  entry: {
    raven: path.resolve(__dirname, './src/utils/raven/index.cjs'),
    bundle: [
      ...(isHMR ? ['react-hot-loader/patch'] : []),
      'core-js/stable/symbol',
      patchedReactDOM,
      /** client polyfills not provided by babel */
      'core-js/features/global-this',
      'core-js/features/string/repeat',
      'core-js/features/string/pad-start',
      'core-js/features/string/pad-end',
      'core-js/stable/promise',
      'core-js/stable/object/assign',
      'intersection-observer',
      'whatwg-fetch',

      /** application code should come last */
      path.resolve(__dirname, './src/styles/styles.pcss'), // couse of side effects
      path.resolve(__dirname, './src/pages'),
    ],
  },

  output: {
    filename: `js/${bundleFileMask}.js`,
    publicPath: '/',
    chunkFilename: isProduction ? './chunks/[name].[chunkhash:8].bundle.js' : './chunks/[name].bundle.js',
    path: path.resolve(__dirname, './build'),
  },

  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    modules: ['node_modules', 'src'],
    symlinks: false,
    alias: {
      'react-dom': patchedReactDOM,
    },
  },

  module: {
    rules: [
      {
        test: require.resolve('./src/pages'),
        use: [
          { loader: 'expose-loader', options: 'MarketEco.pages' },
          { loader: 'babel-loader?cacheDirectory' },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, './src'),
        ],
      },
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader?cacheDirectory' }],
        include: [
          path.resolve(__dirname, './src'),
        ],
      },
      {
        test: require.resolve('./src/utils/raven/index.cjs'),
        use: [
          { loader: 'expose-loader', options: 'Raven' },
          { loader: 'babel-loader?cacheDirectory' },
        ],
      },
      {
        test: require.resolve('react'),
        use: [
          { loader: 'expose-loader', options: 'React' },
        ],
      },
      {
        test: require.resolve(patchedReactDOM),
        use: [
          { loader: 'expose-loader', options: 'ReactDOM' },
        ],
      }, {
        test: /\.(png|jpe?g|gif|cur)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 512,
              name: 'assets/[hash:base64:10].[ext]',
            },
          },
        ],
      }, {
        test: /\.(eot|ttf|woff2?)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 512,
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      }, {
        test: /\.svg$/,
        exclude: /\.url.svg$/,
        use: [{ loader: 'svg-react-loader' }],
      }, {
        test: /\.url.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
          },
          ...isProduction ? [{
            loader: 'svgo-loader',
          }] : []],
      },
      {
        test: /www/,
        exclude: /\.html$/,
        use: [{
          loader: 'file-loader',
          options: { name: '[name].[ext]' },
        }],
      },
      {
        test: /\.pcss$/,
        exclude: /\.global.pcss$/,
        use: [cssLoader, {
          loader: 'css-loader',
          options: {
            modules: true,
            // this hash used for auto tests by QA team on Production
            localIdentName: '[folder]_[local]_[hash:base64:4]',
          },
        }, {
          loader: 'postcss-loader',
        }],
      },
      {
        test: /\.global.pcss$/,
        use: [cssLoader, {
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
        }],
      },
      {
        test: /\.css$/,
        use: [cssLoader, 'css-loader'],
      },
    ],
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ...(isHMR ? [
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: false,
      }),
      new webpack.NamedModulesPlugin(),
    ] : []),
    new HtmlWebpackPlugin({
      template: './src/www/index.html',
      inject: false,
      isProduction: getBuildEnvironment() !== 'local',
      release: currentRelease,
      environment: getBuildEnvironment(),
    }),
    new MiniCssExtractPlugin({
      filename: `css/${bundleFileMask}.css`,
      isHMR: !isProduction,
    }),
    new CopyPlugin(['src/www', './offer.html', { from: './offer-assets', to: './offer-assets' }]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isProduction && !isDebug ? "'production'" : "'development'",
        SUPPORTED_BROWSERS: `'${browserslist(['> 0.5%', 'last 2 versions', 'not dead']).join('|')}'`,
        CURRENT_RELEASE: `'${currentRelease}'`,
        BUILD_CI_BRANCH: JSON.stringify(process.env.CI_BRANCH),
      },
    }),
    ...(isDebug ? [new BundleAnalyzerPlugin()] : []),
  ],

  devtool: isProduction ? 'source-map' : false,
  stats: {
    colors: true,
    chunks: false,
    children: false,
  },
  devServer: {
    hot: true,
    port: 8081,
    overlay: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    proxy: [{
      context: ['/api', '/authorize', '/constants', '/logout', '/chat', '/media'],
      target: 'http://marketing.kube.vimpelcom.ru:80',
      changeOrigin: true,
      secure: false,
    }, {
      context: ['/chat/ws'],
      target: 'ws://marketing.kube.vimpelcom.ru',
      changeOrigin: true,
      ws: true,
      secure: false,
    }],
    stats: {
      children: false,
      colors: true,
      chunks: false,
    },
  },
};
