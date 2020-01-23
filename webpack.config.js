const path = require('path');

module.exports = {
  entry: {
    'max/lp-max-bundle': './src/ts/gn-launchpad-max.ts',
    'web/lp-web-bundle': './src/ts/gn-launchpad-web.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  externals: {
    'max-api': 'commonjs max-api'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node'
};