const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: {
    feather: "./src/feather.ts"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js"
  },
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

// module.exports = [
//   Object.assign(
//     {
//       entry: "./src/sw.ts",
//       output: {
//         path: path.resolve(__dirname, "./dist"),
//         filename: "sw.js"
//       }
//     },
//     defaultConfig
//   ),
//   Object.assign(
//     {
//       entry: "./src/config.ts",
//       output: {
//         path: path.resolve(__dirname, "./dist"),
//         filename: "config.js",
//         library: "_$featherConfig",
//         libraryTarget: "umd",
//         libraryExport: "default"
//       }
//     },
//     defaultConfig
//   ),
//   {
//     devServer: {
//       static: {
//         directory: path.join(__dirname, "public")
//       },
//       compress: true,
//       port: 9000
//     }
//   }
// ];
