const path = require('path');

module.exports = {
  cache: true,
  entry: {
    // common: './app/assets/javascripts/common/index.ts',
    // top: './app/assets/javascripts/top/index.ts',
    // other: './app/assets/javascripts/other/index.ts'
    common: './app/assets/javascripts/common/index.js',
    top: './app/assets/javascripts/top/index.js',
    other: './app/assets/javascripts/other/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    loaders: [
      // {
      //   test: /\.ts(x?)$/,
      //   exclude: /node_modules/,
      //   loader: 'ts'
      // }
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-2'],
          plugins: [
            ['typecheck', {
              disable: {
                production: true,
                release: true
              }
            }],
            'syntax-flow',
            'transform-flow-strip-types'
          ]
        }
      }
    ]
  }
};
