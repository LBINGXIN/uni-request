/**
 * webpack-mock-service-plugin 使用文档
 * https://www.npmjs.com/package/webpack-mock-service-plugin
 */
const path = require("path");
const WebpackMockServicePlugin = require("webpack-mock-service-plugin");
module.exports = {
  configureWebpack: {
    plugins: [new WebpackMockServicePlugin()],
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
