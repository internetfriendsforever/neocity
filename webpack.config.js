module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js^/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new (require('html-webpack-plugin'))({
      title: '🅝🅔🅞🅒🅘🅣🅨'
    })
  ]
}
