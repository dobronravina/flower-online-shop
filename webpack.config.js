const path = require('path');

module.exports = {
   entry: {
    about: './public/js/react/about.js',  
    partners: './public/js/react/partners.js' 
  },
 output: {
  path: path.resolve(__dirname, 'public/js/build'),
  filename: '[name].js',  
  library: {
    type: 'module',
  },
},
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  
   devServer: {
	  static: {
		directory: path.join(__dirname, 'public'),
	  },
	  compress: true,
	  port: 9000,
	  devMiddleware: {
		writeToDisk: true, // Забезпечує збереження файлів на диск
	  }
	},

};
