const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin');

const { NODE_ENV, PUBLIC_PATH, ANALYZER, LOCAL } = process.env;
const isProduction = NODE_ENV === 'production';
const isLocal = !isProduction && Boolean(LOCAL);
const isAnalyzer = isProduction && Boolean(ANALYZER);
const publicPath = isProduction ? '/' + (PUBLIC_PATH ? PUBLIC_PATH + '/' : '') : '/';

class InsertFontCSS {
	constructor(url) {
    this.url = url;
  }

	apply(compiler) {
		compiler.hooks.compilation.tap('InsertFontCSS', (compilation) => {
    		HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('InsertFontCSS', (data, cb) => {
          data.assets.css.push(this.url);
          cb(null, data);
        }
			)
		})
	}
}

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  stats: {
    assets: true,
    children: false,
    colors: true
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: publicPath,
    filename: 'js/bundle.js?[contenthash]'
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [ path.resolve(__dirname, 'node_modules') ]
              }
            }
          }
        ]
      },
      {
        test: /-font\.js$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'webfonts-loader',
            options: {
              publicPath: publicPath
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
            [ '@babel/env', { targets: { browsers: [ 'last 2 versions' ] }, useBuiltIns: false, modules: false } ]
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
          name: '[name].[ext]?[contenthash]',
          outputPath: 'img',
          esModule: false
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[contenthash]',
          outputPath: 'fonts',
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new GoogleFontsPlugin({
      fonts: [
        { family: 'Open Sans', variants: [ '300', '400', '600' ], display: 'swap' },
        { family: 'Roboto Slab', variants: [ '300', '400', '700' ], display: 'swap' }
      ],
      formats: [ 'woff2', 'woff', 'ttf' ],
      path: 'fonts/'
    }),
    new InsertFontCSS('./fonts.css'),
    new HtmlWebpackPlugin({
      title: 'Andrés Brugarolas',
      template: "./src/index.pug",
      filename: "./index.html",
      favicon: './src/images/favicon_simple.png',
      meta: {
        viewport: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no'
      },
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/bundle.css?[contenthash]'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    host: isLocal ? '0.0.0.0' : 'localhost',
    useLocalIp: isLocal
  },
  devtool: 'eval-source-map'
};

if (isProduction) {
  module.exports.devtool = false;
  module.exports.mode = 'production';

  // Add babel-minify preset only in production
  const babelRules = module.exports.module.rules.find(rule => rule.loader === 'babel-loader');
  babelRules.options.presets.unshift(['minify', { builtIns: false }]);
}

if (isAnalyzer) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  module.exports.plugins.push(new BundleAnalyzerPlugin());
}
