const path = require('path');
const util = require('util');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const xConfig = require('x-config-deploy').getConfig();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = require('@x-scaffold/webpack-config');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const QiniuPlugin = require('qiniu-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const IP = require('ip').address();
const portFinderSync = require('portfinder-sync');
const _ = require('node-plus-string');

const pkg = require('./package.json');
const PORT = portFinderSync.getPort(8080);
const PROJECT_NANE = getProjectName();
const qiniuDomain = xConfig.qiniuLibConfig.origin;
const distBasePath = `s/${pkg.version}`;

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

function getProjectName() {
  return pkg.name;
}

const cleanPlugin = new CleanWebpackPlugin(['dist'], {
  verbose: true,
});

const qiniuPluginAssets = new QiniuPlugin({
  ACCESS_KEY: xConfig.qiniuLibConfig.accessKey,
  SECRET_KEY: xConfig.qiniuLibConfig.secretKey,
  bucket: xConfig.qiniuLibConfig.bucket,
  // include 可选项。你可以选择上传的文件，比如['main.js']``或者[/main/]`
  include: [new RegExp(getProjectName())],
  path: distBasePath,
});

module.exports = {
  entry: {
    index: './src/lib.js',
  },
  output: {
    hashDigestLength: 8,
    path: path.resolve(__dirname, './dist/'),
    filename: `${getProjectName()}.js`,
    // chunkFilename: `[name].js`,
    publicPath: process.env.NODE_ENV === 'production' ? qiniuDomain : `//${IP}:${PORT}/`,
    library: _.camelize(pkg.name),
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: webpackConfig.styleLoaders({
      sourceMap: false,
      extract: process.env.NODE_ENV === 'production' }).concat([
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve('src')],
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: webpackConfig.loaders,
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        loader: 'file-loader',
        options: {
          name: '[name][hash].[ext]',
        },
      },
    ]),
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('node_modules'),
    ],
    extensions: ['.js', '.vue', '.json'],
    // root: path.resolve('src'),
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      src: resolve('src'),
    },
  },
  devServer: {
    host: IP,
    hot: false,
    open: true,
    port: PORT,
    // https: true,
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  plugins: [
    cleanPlugin,
    new StyleLintPlugin({
      failOnError: false,
      files: ['**/*.s?(a|c)ss', 'src/**/**/*.vue', 'src/***/*.css'],
      // files: '../static/.css'
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   chunks: ['index'],
    //   showErrors: true,
    //   hash: false,
    //   inject: true,
    //   chunksSortMode: 'dependency',
    // }),
  ],
};

if (process.env.NODE_ENV === 'development') {
  module.exports = Object.assign(module.exports, {
    // devtool: '#eval-source-map',
    devtool: '#source-map',
  });
}

if (process.env.NODE_ENV === 'production') {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    qiniuPluginAssets,
    // http://mobilesite.github.io/2017/02/18/all-the-errors-encountered-in-webpack/
    // https://segmentfault.com/q/1010000008716379
    new ExtractTextPlugin({
      disable: false,
      filename: '[name].css',
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}