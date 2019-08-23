const path = require('path');
const SRC = path.join(__dirname, 'client', 'index.jsx');
const BUILD = path.join(__dirname, 'build');


module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    client: SRC,
  },
  output: {
    path: BUILD,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
};
