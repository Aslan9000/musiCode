const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const devMode = process.env.npm_lifecycle_event !== "build";

module.exports = {
  entry: './frontend/main.js',
  output: {
    filename: 'main-bundled.js',
    path: path.resolve(__dirname, 'public')
  },
  mode: devMode ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules|bower_components/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [{
          // inject CSS to page
          loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
        }, {
          // translates CSS into CommonJS modules
          loader: 'css-loader'
        }, {
          // Run postcss actions
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        }, {
          // compiles Sass to CSS
          loader: 'sass-loader'
        }],
      }
    ]
  },
  plugins: devMode ? [] : [new MiniCssExtractPlugin()],
  optimization: devMode ? {} : {minimizer: [`...`, new CssMinimizerPlugin(),
  ]},
}