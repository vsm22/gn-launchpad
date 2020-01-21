const path = require('path');

module.exports = {
  entry: './src/ts/gn-launchpad-web.ts',
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
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  externals: {
    'max-api': 'max-api'
  },
  output: {
    filename: 'web-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};