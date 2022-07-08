const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  plugins: [new Dotenv({
    //   path: './some.other.env', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      defaults: true, // load '.env.defaults' as the default values if empty.
    })],

  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  target: "node",
  
};
