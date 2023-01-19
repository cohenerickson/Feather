const path = require("path");

module.exports = {
  entry: {
    worker: "./src/sw.ts",
    bundle: "./src/bundle.ts",
    client: "./src/client.ts"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js"
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
    proxy: {
      "/bare/": {
        pathRewrite: { "^/bare/": "" },
        target: "http://localhost:8080",
        ws: true
      }
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
