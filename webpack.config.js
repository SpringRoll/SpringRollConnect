const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { resolve } = require('path');
const { ProvidePlugin } = require('webpack');
module.exports = () => ({
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  entry: {
    main: './src/index.js',
    libraries: './src/libraries.js',
    embed: './src/embed/index.js'
  },
  output: {
    path: resolve(__dirname, 'app/public/js')
  },
  plugins: [
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      '$.mobile': 'jquery-mobile'
    }),
    new MiniCssExtractPlugin({
      filename: `../css/[name].css`,
      chunkFilename: '[id].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../fonts/[name].[ext]'
              // outputPath: `../fonts/`
            }
          }
        ]
      },
      {
        test: /\.(jpeg|jpg|png)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../images/[name].[ext]'
            }
          }
        ]
      }
    ]
  }
});
