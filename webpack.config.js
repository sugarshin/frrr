const path = require('path');
const webpack = require('webpack');

const release = process.env.NODE_ENV === 'release';
const plugins = release ? [new webpack.optimize.UglifyJsPlugin({
  comment: '@license'
})] : [];

module.exports = {
  entry: {
    top: './app/assets/javascripts/top/index.ts',
    other: './app/assets/javascripts/other/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        include: __dirname
      }
    ]
  },
  extensions: ['.ts', '.tsx'],
  externals: {
    react: 'React'
  },
  plugins
};
