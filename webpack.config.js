const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: "all"
    }
  },
  entry: path.resolve(__dirname, "src/ts/index.ts"),
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        rules: [
          {
            test: /\.scss$/,
            use: [
              // fallback to style-loader in development
              process.env.NODE_ENV != "production"
                ? "style-loader"
                : MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader"
            ]
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      },
      {
        test: /three\/examples\/js/,
        use: "imports-loader?THREE=three"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "three-examples": path.join(__dirname, "./node_modules/three/examples/js")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Floopy Bird",
      template: path.resolve(__dirname, "src/index.html")
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CompressionPlugin({
      filename: "[path].br[query]",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ],
  output: {
    filename: "bundle.js",

    path: path.resolve(__dirname, "dist")
  }
};
