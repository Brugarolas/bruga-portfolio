const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProvidePlugin } = require('webpack');

const { NODE_ENV, PUBLIC_PATH } = process.env;
const isProduction = NODE_ENV === 'production';
const publicPath = isProduction ? '/' + (PUBLIC_PATH ? PUBLIC_PATH + '/' : '') : '/';

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  stats: { children: false },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: publicPath,
    filename: 'js/bundle.js?[hash]'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction ? 'style-loader' : 'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          { loader: isProduction ? 'style-loader' : 'css-hot-loader' },
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [ path.resolve(__dirname, 'node_modules') ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [ '@babel/env', { targets: { browsers: [ 'last 2 versions' ] }, useBuiltIns: 'usage', corejs: 3, modules: false } ]
          ],
          plugins: [
            [ '@babel/transform-runtime', { corejs: 3 } ]
          ]
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'img'
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'fonts'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Andrés Brugarolas',
      template: "./src/index.pug",
      filename: "./index.html",
      favicon: './src/images/favicon_simple.png',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/bundle.css?[hash]'
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devtool: '#eval-source-map'
};

if (isProduction) {
  module.exports.devtool = '#source-map';
  module.exports.mode = 'production';
}

if (publicPath !== '/') {
  module.exports.devtool = '';
}
