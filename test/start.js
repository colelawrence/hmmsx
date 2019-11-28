//@ts-check
const path = require("path");
const webpack = require("webpack");
const DevServer = require("webpack-dev-server");

const compiler = webpack({
  entry: testRoot("./test.tsx"),
  mode: "development",
  devtool: "inline-source-map",
  context: testRoot("../"),
  output: {
    path: testRoot("../docs"),
    pathinfo: true,
    filename: "bundle.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [testRoot(), testRoot("../src")],
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  }
});

const devServer = new DevServer(compiler, {
  hot: true,
  inline: true,
  contentBase: testRoot("./public")
});

const port = Number(process.env.NODE_PORT) || 3000;
const host = process.env.NODE_HOST || "0.0.0.0";

devServer.listen(port, host, () => {
  console.log(`dev server listening on http://${host}:${port}`);
});

function testRoot(...parts) {
  return path.join(__dirname, ...parts);
}
