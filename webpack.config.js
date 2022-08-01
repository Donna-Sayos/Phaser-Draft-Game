const path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/index.js',
  output: {
    path: __dirname,
    filename: './public/bundle.js',
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'js/scenes'),
    },
    extensions: ['.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [
        {
            exclude: /node_modules/,
        }
    ],
  },
};