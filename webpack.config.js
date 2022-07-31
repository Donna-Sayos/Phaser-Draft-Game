module.exports = {
  entry: './js/index.js',
  output: {
    path: __dirname,
    filename: './public/bundle.js',
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