const path = require("path");

module.exports = {
  entry: {
    config: "./src/config.ts",
    worker: "./src/worker.ts",
    client: "./src/client/index.ts",
    bundle: "./src/bundle.ts"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    sourceMapFilename: "[name].js.map",
    clean: true
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public")
    },
    compress: true,
    port: 9000
  }
};
